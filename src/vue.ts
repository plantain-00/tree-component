import * as Vue from "vue";
import Component from "vue-class-component";

@Component({
    template: `
    <editor :schema="schema"
        :initial-value="initialValue"
        :theme="themeObject"
        :locale="localeObject"
        :icon="iconObject"
        :readonly="readonly"
        :required="true"
        @update-value="updateValue(arguments[0])"
        :dragula="dragula"
        :md="md"
        :hljs="hljs"
        :forceHttps="forceHttps">
    </editor>
    `,
    props: ["schema", "initialValue", "theme", "icon", "locale", "readonly", "dragula", "markdownit", "hljs", "forceHttps"],
})
class JSONEditor extends Vue {
    theme: string;
    locale: string;
    icon: string;
    markdownit: typeof MarkdownIt;
    hljs: typeof hljs;
    forceHttps: boolean;

    themeObject = common.getTheme(this.theme);
    localeObject: common.Locale;
    iconObject: common.Icon;
    md = common.initializeMarkdown(this.markdownit, this.hljs, this.forceHttps);

    constructor() {
        super();
        this.localeObject = common.getLocale(this.locale);
        this.iconObject = common.getIcon(this.icon, this.localeObject);
    }

    updateValue(value: common.ValueType) {
        this.$emit("update-value", value);
    }
}

Vue.component("tree", JSONEditor);
