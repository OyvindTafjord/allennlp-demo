import React from 'react';
import { withRouter } from 'react-router-dom';
import Model from '../Model'
import OutputField from '../OutputField'
import { API_ROOT } from '../../api-config';
import { truncateText } from '../DemoInput'

const title = "Rule Reasoning"

const description = (
  <span>
    Resolve statements to True or False (under closed world assumption) given a rulebase.
  </span>
  )

const taskModels = [
  {
    name: "RoBERTa-SyntRuleCombo4b-D3 + TurkNL",
    desc: "RoBERTa trained on combination of D<=3 synthetic rules and turked language"
  }
]

const taskEndpoints = {
  "RoBERTa-SyntRuleCombo4b-D3 + TurkNL": "rule-reasoning"
};

const fields = [
  {name: "passage", label: "Rulebase", type: "TEXT_AREA",
   placeholder: `E.g. "Bob is blue. If someone is blue then they are rough."`},
  {name: "question", label: "Question or statement", type: "TEXT_INPUT",
   placeholder: `Either statement like "Bob is blue" or MC question "Which is true? (A) Bob is blue. (B) Bob is red."`},
  {name: "model", label: "Model", type: "RADIO", options: taskModels, optional: true}
]

const NoAnswer = () => {
  return (
    <OutputField label="Answer">
      No answer returned.
    </OutputField>
  )
}

const AnswerByType = ({ responseData, requestData, interpretData, interpretModel, attackData, attackModel}) => {
  if(requestData && responseData) {
    const { passage, question } = requestData;
    const { answer_strings } = responseData;

    const answer_items = answer_strings.map((ans) => <li>{ans}</li> )
    return (
            <section>
              <OutputField label="Answer">
                <ul>{answer_items}</ul>
              </OutputField>
            </section>);
  }
  return NoAnswer();
}

const Output = (props) => {
  return (
    <div className="model__content answer">
      <AnswerByType {...props}/>
    </div>
  )
}

const addSnippet = (example) => {
  return {...example, snippet: truncateText(example.question)}
}

const examples = [
  ['AttNoNeg', [
        {
          passage: "Bob is blue. Alan is red.",
          question: "Which is true? (A) Bob is blue (B) Bob is red. (C) Alan is red.",
        }
      ].map(addSnippet)],

  ['PropNeg', [
        {
          passage: "John chases Bob. Bob does not like John. If someone likes John then they chase John.",
          question: "Bob chases John.",
        }
    ].map(addSnippet)]

]


const getUrl = (model, apiCall) => {
    const selectedModel = model || (taskModels[0] && taskModels[0].name);
    const endpoint = taskEndpoints[selectedModel]
    return `${API_ROOT}/${apiCall}/${endpoint}`
}

const apiUrl = ({model}) => {
    return getUrl(model, "predict")
}

const apiUrlInterpret = ({model}) => {
    return getUrl(model, "interpret")
}

const apiUrlAttack = ({model}) => {
    return getUrl(model, "attack")
}

const modelProps = {apiUrl, apiUrlInterpret, apiUrlAttack, title, description, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)
