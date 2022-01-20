import type {FontmatterInput, MarkdownPrettifierOptions} from "./domain";
import {CachedMetadata} from "obsidian";
import Templates from "./templates";
import {DEFAULT_OPTIONS} from "./constants";
import jsYaml from "js-yaml";

const template = new Templates();

function trim(txt: string) {
    return txt.replace(/^---+|---$/gm, '')
}

async function frontmatter(
    content: string,
    cachedMetadata: CachedMetadata,
    userOptions: MarkdownPrettifierOptions,
    frontmatterInput: FontmatterInput
) {

    let options = {...DEFAULT_OPTIONS, ...userOptions};

    const frontmatter = cachedMetadata.frontmatter
    if (frontmatter) {
        // Update the frontmatter
        let fmtext = content?.substring(frontmatter.position.start.offset,
            frontmatter.position.end.offset)

        fmtext = trim(fmtext)

        // put quotes around the
        // - #value
        //
        // and tags: #value
        // and tag: #value
        fmtext = fmtext.replace(
            /(^|-\s|tags:\s|tag:\s)(#[a-z//\d-_]+)/gi,
            "$1'$2'"
        );

        const newValues = newValuesYAML(options.newHeaderTemplate, frontmatterInput)
        const currentYaml = jsYaml.load(fmtext);
        const merged = mergeValues(currentYaml, newValues)

        if (frontmatterInput.addUUIDIfNotPresent && !merged.id){
            merged.id = template.getNewUUID()
        }

        const nofmtext = content?.substring(frontmatter.position.end.offset+1)
        content = appendFrontMatter(nofmtext, merged)

    } else if (options.createHeaderIfNotPresent) {
        // Append the frontmatter
        const newYaml = newValuesYAML(options.newHeaderTemplate, frontmatterInput)
        content = appendFrontMatter(content, newYaml)
    }
    return content;

}

function appendFrontMatter(content: string, yaml: any) {
    return `---
${jsYaml.dump(yaml)}---
${content}`
}

function newValuesYAML(newHeaderTemplate: string, frontMatterData: FontmatterInput) {

    // Update uuids
    newHeaderTemplate = template.replaceUUID(newHeaderTemplate)

    // Update dates and times
    if (frontMatterData.today) {
        newHeaderTemplate = String(
            template.replaceDates(newHeaderTemplate, frontMatterData.today)
        );
    }

    // Add things like new tags
    let resultYaml: any = jsYaml.load(newHeaderTemplate);
    if (frontMatterData.tags && frontMatterData.tags.length > 0) {
        resultYaml.tags = frontMatterData.tags;
    }

    // Return a map
    return resultYaml;
}

function getUnion(first: any, second: any):Array<string>{
    let firstArray = first ? first : []
    let secondArray = second ? second : []
    if (typeof firstArray === "string" || firstArray instanceof String) {
        firstArray = [firstArray];
    }
    if (typeof secondArray === "string" || secondArray instanceof String) {
        secondArray = [secondArray];
    }
    return Array.from(
        new Set([...firstArray, ...secondArray]).values()
    );
}

function mergeValues(currentYaml: any, newYAML: any) {

    // Assign all new values
    if (currentYaml) {
        Object.assign(currentYaml, newYAML);
    }

    // Calculate the union of tags
    const tagUnion:Array<string> = getUnion(currentYaml.tags,newYAML.tags)
    if (tagUnion.length>0){
        currentYaml.tags = tagUnion;
    }

    return currentYaml;
}


export default frontmatter
