import jsYaml, {DEFAULT_SCHEMA} from 'js-yaml'
import moment from 'moment'
import {DATE_REGEX, DEFAULT_DATE_FORMAT} from "./constants";
import {v4 as uuidv4} from 'uuid';

/**
 * From note-refactor-obsidian
 */
class Templates {
    findHashtags(searchText: string) {
        return searchText.split(/\s/gm).filter((s) => {
            if (s === "#") {
                return false;
            }
            if (s.startsWith("##")) {
                return false;
            }
            return s.startsWith("#");
        });
    }

    isValidYaml(input: string) {
        try {
            jsYaml.dump(jsYaml.load(String(input)));
            return true;
        } catch (error) {
            return false;
        }
    }

    replaceUUID(input: string) {
        if (input.includes('{{UUID}}')) {
            const uuid = uuidv4()
            input = input.replace('{{UUID}}', uuid)
        }
        return input
    }

    replaceDates(input: string, moment: moment.Moment) {
        //A regex to capture multiple matches, each with a target group ({date:YYMMDD}) and date group (YYMMDD)
        const dateRegex = DATE_REGEX;
        const customFolderString = input;
        //Iterate through the matches to collect them in a single array
        const matches = [];
        let match;
        while ((match = dateRegex.exec(customFolderString))) {
            matches.push(match);
        }
        //Return the custom folder setting value if no dates are found
        if (!matches || matches.length === 0) {
            return input;
        }
        //Transform date matches into moment formatted dates
        const formattedDates = matches.map((m) => {
            //Default to YYYYMMDDHHmm if {{date}} is used
            const dateFormat =
                m.groups.date === "" ? DEFAULT_DATE_FORMAT : m.groups.date;
            return [m.groups.target, moment.format(dateFormat)];
        });

        //Check to see if any date formatting is needed. If not return the unformatted setting text.
        let output = customFolderString;
        formattedDates.forEach((fd) => {
            output = output.replace(fd[0], fd[1]);
        });
        return output;
    }

}

export default Templates