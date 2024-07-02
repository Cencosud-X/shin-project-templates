module.exports = {
  API_DOCS: [
    {{#if data.settings.apiDocs}}
        {{#each data.settings.apiDocs}}
    {
        to: "/api-doc?url={{this.to}}",
        label : "{{this.label}}"
    },
        {{/each}}
    {{/if}}
  ]
};
