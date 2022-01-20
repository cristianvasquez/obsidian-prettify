import type {FontmatterInput, MarkdownPrettifierOptions} from "./domain";
import Templates from "./templates";
import {DEFAULT_OPTIONS} from "./constants";
// https://npm.io/package/gray-matter
import matter from 'gray-matter'
import yaml from 'js-yaml'
const templateUtil = new Templates();

function addQuotesToTags(txt) {
    // put quotes around the
    // - #value
    //
    // and tags: #value
    // and tag: #value
    //
    return txt.replace(
        /^(- |tags:|tag:)\s?(#[a-z//\d-_]+)/gi,
        "$1'$2'"
    );
}


async function frontmatter(
    content: string,
    userOptions: MarkdownPrettifierOptions,
    frontmatterInput: FontmatterInput
) {

    let options = {...DEFAULT_OPTIONS, ...userOptions};

    if (content.split('---\n',3).length===3) {
        const frontMatter = content.split('---\n',3).join('---\n')
        const frontMatterQuotes  = addQuotesToTags(frontMatter)
        content.replace(frontMatter,frontMatterQuotes)
    }

    const file = matter(content)

    function applyUUID(data){
        if (frontmatterInput.addUUIDIfNotPresent && !data.id) {
            data.id = templateUtil.getNewUUID()
        }
        return data
    }

    const noData = (file) => Object.keys(file.data).length === 0

    if (noData(file) && options.createHeaderIfNotPresent) {
        file.data = applyValues(options.newHeaderTemplate, frontmatterInput)
    } else if (options.updateHeaders){
        const data = applyValues(options.updateHeaderTemplate, frontmatterInput)
        file.data = mergeValues(file.data, data)
    }

    file.data = applyUUID(file.data)
    return matter.stringify(file.content, file.data).replace(/\n$/, "");
}

function addDashes(template){
    return `---
${template}
---`
}

function applyValues(template: string, frontMatterData: FontmatterInput) {

    const newTags = (opt) => (opt.tags && opt.tags?.length > 0)
    // Update uuids
    template = templateUtil.replaceUUID(template)

    // Update dates and times
    if (frontMatterData.today) {
        template = String(
            templateUtil.replaceDates(template, frontMatterData.today)
        );
    }
    // Add things like new tags
    let doc =  matter(addDashes(template))
    if (newTags(frontMatterData)) {
        doc.data.tags = frontMatterData.tags;
    }
    return doc.data;
}

function getUnion(first: any, second: any): Array<string> {
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
    const tagUnion: Array<string> = getUnion(currentYaml.tags, newYAML.tags)
    if (tagUnion.length > 0) {
        currentYaml.tags = tagUnion;
    }

    // Calculate the union of aliases
    const aliasUnion: Array<string> = getUnion(currentYaml.alias, newYAML.alias)
    if (aliasUnion.length > 0) {
        currentYaml.aliasUnion = aliasUnion;
    }

    return currentYaml;
}


export default frontmatter
