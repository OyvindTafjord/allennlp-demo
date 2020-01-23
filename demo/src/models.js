import RuleReasoning from './components/demos/RuleReasoning';
import TextualEntailment from './components/demos/TextualEntailment';
import annotateIcon from './icons/annotate-14px.svg';
import otherIcon from './icons/other-14px.svg';
import parseIcon from './icons/parse-14px.svg';
import passageIcon from './icons/passage-14px.svg';
import questionIcon from './icons/question-14px.svg';
import addIcon from './icons/add-14px.svg';

// This is the order in which they will appear in the menu
const modelGroups = [

    {
        label: "Reason over rulebases",
        iconSrc: questionIcon,
        defaultOpen: true,
        models: [
            {model: "roberta-rule-reasoning", name: "Reason with rules", component: RuleReasoning}
        ]
    },
    {
        label: "Other",
        iconSrc: otherIcon,
        defaultOpen: true,
        models: [
            {model: "textual-entailment", name: "Textual Entailment", component: TextualEntailment},
        ]
    }
]

// Create mapping from model to component
let modelComponents = {}
modelGroups.forEach((mg) => mg.models.forEach(({model, component}) => modelComponents[model] = component));

let modelRedirects = {}
modelGroups.forEach((mg) => mg.models.forEach(
  ({model, redirects}) => {
    if (redirects) {
      redirects.forEach((redirect) => modelRedirects[redirect] = model)
    }
  }
));

export { modelComponents, modelGroups, modelRedirects }
