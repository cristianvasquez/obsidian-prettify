
import Templates from "../templates";

const template = new Templates();
import moment from 'moment'
const one_day_in_the_past = moment('2010-06-09T15:20:00-07:00')

it("No date format formatting using standad format", () => {
    const input = `---
date updated: '{{date}}' 
---`;
    const expectedOuput = `---
date updated: '201006100020' 
---`;
    const data = template.replace(input, one_day_in_the_past)
    expect(data).toBe(expectedOuput);
});

it("YYYYMMDD format", () => {
    const input = `---
date updated: '{{date:YYYYMMDD}}' 
---`;
    const expectedOuput = `---
date updated: '20100610' 
---`;

    const data = template.replace(input, one_day_in_the_past)
    expect(data).toBe(expectedOuput);
});

it("Multiple dates", () => {
    const input = `---
date updated: '{{date:YYYY}}/{{date:MMM}}/{{date:DD_ddd}}' 
---`;
    const expectedOuput = `---
date updated: '2010/Jun/10_Thu' 
---`;

    const data = template.replace(input, one_day_in_the_past)
    expect(data).toBe(expectedOuput);

});

it("Check for invalid YAML", () => {
    const input = `---
property: 'take out the first and last line'
---`;
    const expectedOuput = false

    const data = template.isValidYaml(input)
    expect(data).toBe(expectedOuput);

});
it("Check for valid YAML", () => {
    const input = `property: 'take out the first and last line'`;
    const expectedOuput = true

    const data = template.isValidYaml(input)
    expect(data).toBe(expectedOuput);

});


it("Respect emojis", () => {
    const input = `---
Name: 🦐 
---`;
    const expectedOuput = `---
Name: 🦐 
---`;
    const data = template.replace(input, one_day_in_the_past)
    expect(data).toBe(expectedOuput);
});


it("Finds hashtags", () => {
    const input = `
    ## Hello
    #ble
    #bla_bla####
    #ble\Blu
    #ble/bla/blo #blex#blix
    #
    `;

    const data = template.findHashtags(input)
    expect(data).toEqual(['#ble', '#bla_bla####', '#bleBlu', '#ble/bla/blo', '#blex#blix']);
});
