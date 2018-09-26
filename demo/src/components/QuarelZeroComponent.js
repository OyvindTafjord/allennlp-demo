import React from 'react';
import HeatMap from './heatmap/HeatMap'
import Collapsible from 'react-collapsible'
import { API_ROOT } from '../api-config';
import { withRouter } from 'react-router-dom';
import {PaneLeft, PaneRight} from './Pane'
import Button from './Button'
import ModelIntro from './ModelIntro'


/*******************************************************************************
 <McInput /> Component
 *******************************************************************************/

var parserExamples = {};

parserExamples["quarel"] = [
  {
    question: "Bill eats way more sweets than Sue. Based on this, who is more likely to get diabetes? (A) Sue (B) Bill",
    qrspec: "[sugar, +diabetes]",
    entitycues: ""
  },
  {
    question: "In his research, Joe is finding there's a lot more diabetes in the city than in the countryside. He hypothesizes this is because people consume less sugar in the (A) city (B) countryside",
    qrspec: "[sugar, +diabetes]",
    entitycues: ""
  },
  {
    question: "John finds less pollution these days compared to earlier. He thinks that maybe now there are  ___ cars than earlier. (A) Less  (B) More",
    qrspec: "[pollution, +vehicles, -air quality]",
    entitycues: ""
  },
  {
    question: "There are way fewer trucks driving through Bob's city than Sue's city. Where would one expect air quality to be higher? (A) Bob's city (B) Sue's city",
    qrspec: "[pollution, +vehicles, -air quality]",
    entitycues: "vehicles: cars, trucks"
  },
  {
    question: "There are way fewer trucks driving through Bob's city than Sue's city. Where would one expect air quality to be higher? (A) Bob's city (B) Sue's city",
    qrspec: "[pollution, +vehicles, -air quality]*",
    entitycues: "vehicles: cars, trucks*"
  },
  {
    question: "Mary has always been weaker then Jimbo. Which person is able to throw a ball farther? (A) Jimbo (B) Mary",
    qrspec: "",
    entitycues:""
  },
  {
    question: "An empty pot generates less heat when Mary slides it the wood counter than it does when she slides it across a dish towel. This is because the _____ has less resistance. (A) towel (B) wood counter",
    qrspec: "",
    entitycues:""
  },
  {
    question: "A hockey puck slides a lot longer on a frozen lake then on a slushy lake. This means the surface of the _____ is smoother (A) frozen lake (B) slushy lake",
    qrspec: "",
    entitycues:""
  },
  {
    question: "The sun has much more mass than the earth so it has (A) weaker gravity (B) stronger gravity",
    qrspec: "",
    entitycues:""
  },
  {
    question: "Annabel and Lydia are riding their tricycles. Lydia is not as fast as Annabel is. Which one goes a shorter distance? (A) Annabel (B) Lydia",
    qrspec: "",
    entitycues:""
  },
  {
    question: "The fastest land animal on earth, a cheetah was having a 100m race against a rabbit. Which one one the race? (A) the cheetah (B) the rabbit",
    qrspec: "",
    entitycues:""
  },
  {
    question: "Jim was playing with his new ball. He rolled it on the carpet in his living room and it didn't go very far. He decided to go outside and play. Jim rolled his ball on the concrete driveway and it went a much longer distance. He realized there was more resistance to the ball on (A) the carpet (B) the concrete.",
    qrspec: "",
    entitycues:""
  },
  {
    question: "If Mona is doing pushups and Milo is reading a book, which person is sweating less? (A) Mona (B) Milo",
    qrspec: "",
    entitycues:""
  },
  {
    question: "James has rigorous fencing lessons in the morning, and in the evening goes to see a film at the cinema with his girlfriend. Where is he less likely to be sweaty? (A) While fencing (B) While watching a movie",
    qrspec: "",
    entitycues:""
  },
  {
    question: "Jose pushed his burrito cart on the bumpy sidewalk and went slow, while much faster on the street because it had (A) more resistance (B) less resistance",
    qrspec: "",
    entitycues:""
  }
];

var qrspecDefault = {};
qrspecDefault["quarel"] = "[friction, -speed, -smoothness, -distance, +heat]\n[speed, -time]\n[speed, +distance]\n[time, +distance]\n[weight, -acceleration]\n[strength, +distance]\n[strength, +thickness]\n[mass, +gravity]\n[flexibility, -breakability]\n[distance, -loudness, -brightness, -apparentSize]\n[exerciseIntensity, +amountSweat]";

var entitycuesDefault = {};
entitycuesDefault["quarel"] = "friction: resistance, traction\nspeed: velocity, pace, fast, slow, faster, slower, slowly, quickly, rapidly\ndistance: length, way, far, near, further, longer, shorter, long, short, farther, furthest\nheat: temperature, warmth, smoke, hot, hotter, cold, colder\nsmoothness: slickness, roughness, rough, smooth, rougher, smoother, bumpy, slicker\nacceleration: \namountSweat: sweat, sweaty\napparentSize: size, large, small, larger, smaller\nbreakability: brittleness, brittle, break, solid\nbrightness: bright, shiny, faint\nexerciseIntensity: excercise, run, walk\nflexibility: flexible, stiff, rigid\ngravity: \nloudness: loud, faint, louder, fainter\nmass: weight, heavy, light, heavier, lighter, massive\nstrength: power, strong, weak, stronger, weaker\nthickness: thick, thin, thicker, thinner, skinny\ntime: long, short\nweight: mass, heavy, light, heavier, lighter";

var title = {};
var description = {};

title["quarel"] = "Qualitative Relations Story Question Answering";
description["quarel"] = (
  <span>
  Answer story questions about qualitative relations (QuaRel dataset) while adding new relations
  without retraining. This uses the QuaSP+Zero semantic parser described in <i>QuaRel: A Dataset and Models for
  Answering Questions about Qualitative Relationships</i> (in submission). The first few examples use
  new relations, the rest are from the validation set.
  </span>
);

function appendDefault(value, deflt) {
  if (value == null) {
    return deflt
  }
  if (value.slice(-1) === "*") {
    return value.slice(0,-1)
  } else if (value === "") {
    return deflt
  } else {
    return value + "\n" + deflt
  }
}


class QuarelInput extends React.Component {
  constructor(props) {
    super(props);

    // If we're showing a permalinked result,
    // we'll get passed in a question.
    const { question, qrspec, entitycues, mode } = props;

    this.mode = mode;

    this.state = {
      questionValue: question || "",
      qrspecValue: qrspec || "",
      entitycuesValue: entitycues || ""
    };
    this.handleListChange = this.handleListChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleQRSpecChange = this.handleQRSpecChange.bind(this);
    this.handleEntitycuesChange = this.handleEntitycuesChange.bind(this);
  }

  handleListChange(e) {
    if (e.target.value !== "") {
      this.setState({
        questionValue: parserExamples[this.mode][e.target.value].question,
        qrspecValue: appendDefault(parserExamples[this.mode][e.target.value].qrspec, qrspecDefault[this.mode]),
        entitycuesValue: appendDefault(parserExamples[this.mode][e.target.value].entitycues,entitycuesDefault[this.mode]),
      });
    }
  }

  handleQuestionChange(e) {
    this.setState({
      questionValue: e.target.value,
    });
  }

  handleQRSpecChange(e) {
    this.setState({
      qrspecValue: e.target.value,
    });
  }

  handleEntitycuesChange(e) {
    this.setState({
      entitycuesValue: e.target.value,
    });
  }

  render() {

    const { questionValue, qrspecValue, entitycuesValue } = this.state;
    const { outputState, runParser } = this.props;

    const parserInputs = {
      "questionValue": questionValue,
      "qrspecValue": qrspecValue,
      "entitycuesValue": entitycuesValue
    };

    return (
      <div className="model__content">
      <ModelIntro title={title[this.mode]} description={description[this.mode]} />
      <div className="form__instructions"><span>Enter text or</span>
    <select disabled={outputState === "working"} onChange={this.handleListChange}>
  <option value="">Choose an example...</option>
    {parserExamples[this.mode].map((example, index) => {
      return (
    <option value={index} key={index}>{example.question.substring(0,60) + "..."}</option>
  );
  })}
  </select>
    </div>
    <div className="form__field">
      <label htmlFor="#input--mc-question">Question</label>
      <textarea onChange={this.handleQuestionChange} id="input--mc-question" type="text" required="true" value={questionValue}
    placeholder="E.g. &quot;William is ice skating and notices that his ice skates glides quicker on wet ice as opposed to freshly fallen snow. The reason for this is because there is more friction on the (A) wet ice (B) freshly fallen snow&quot;"
    disabled={outputState === "working"} />
  </div>
    <div className="form__field">
      <label htmlFor="#input--qr-spec">Qualitative Relations</label>
    <textarea onChange={this.handleQRSpecChange} id="input--qr-spec" type="text" required="true" value={qrspecValue}
    placeholder="[friction, -speed, +heat]&#013; &#010;[weight, acceleration]"
    disabled={outputState === "working"} />
  </div>
    <div className="form__field">
      <label htmlFor="#input--entitycues">Attribute Cues</label>
    <textarea onChange={this.handleEntitycuesChange} id="input--entitycues" type="text" required="true" value={entitycuesValue}
    placeholder="friction: resistance&#013; &#010;speed: velocity, fast, slow"
    disabled={outputState === "working"} />
  </div>
    <div className="form__field form__field--btn">
      <Button enabled={outputState !== "working"} runModel={runParser} inputs={parserInputs} />
      </div>
      </div>
  );
  }
}


/*******************************************************************************
 <QuarelOutput /> Component
 *******************************************************************************/

class QuarelOutput extends React.Component {
  render() {
    const { answer, logicalForm, score, actions, question_tokens, worldExtractions, explanation } = this.props;

    return (
      <div className="model__content">
      <div className="form__field">
      <label>Answer</label>
      <div className="model__content__summary">{ answer }</div>
      </div>

      <div className="form__field">
      <label>Explanation</label>
      <div className="model__content__summary">
      {explanation.map((entry) => (
      <div><div className="model__explanation__header">{ entry.header }:</div>
    <ul className="model__explanation__ul">{
        entry.content.map((c) => (<li className="model__explanation__ul">{c}</li>))
  }</ul>
    </div>
  ))}
  </div>
    </div>

    <div className="form__field">
      <Collapsible trigger="Model internals">
      <div className="form__field">
      <label>Logical Form</label>
    <div className="model__content__summary">{ logicalForm }</div>
      </div>
      <div className="form__field">
      <label>Score</label>
      <div className="model__content__summary">{ score }</div>
      </div>

      <div className="form__field">
      <label>Extracted world entities</label>
    <div className="model__content__summary">world1: { worldExtractions.world1 },
    world2: { worldExtractions.world2 }</div>
    </div>
    <Collapsible trigger="Predicted actions">
      {actions.map((action, action_index) => (
      <Collapsible key={"action_" + action_index} trigger={action['predicted_action']}>
      <ActionInfo action={action} question_tokens={question_tokens}/>
      </Collapsible>
  ))}
  </Collapsible>
    </Collapsible>
    </div>
    </div>
  );
  }
}


class ActionInfo extends React.Component {
  render() {
    const { action, question_tokens } = this.props;
    const question_attention = action['question_attention'].map(x => [x]);
    const considered_actions = action['considered_actions'];
    const action_probs = action['action_probabilities'].map(x => [x]);

    const probability_heatmap = (
      <div className="heatmap">
      <HeatMap xLabels={['Prob']} yLabels={considered_actions} data={action_probs} xLabelWidth={250} />
      </div>
  );
    const question_attention_heatmap = question_attention.length > 0 ? (
    <div className="heatmap">
      <HeatMap xLabels={['Prob']} yLabels={question_tokens} data={question_attention} xLabelWidth={70} />
      </div>
  ) : (
      ""
    );


    return (
      <div>
      {probability_heatmap}
      {question_attention_heatmap}
      </div>
    )
  }
}


/*******************************************************************************
 <McComponent /> Component
 *******************************************************************************/

class _QuarelZero extends React.Component {

  constructor(props) {
    super(props);

    const { requestData, responseData, mode } = props;

    this.mode = mode;

    this.state = {
      outputState: responseData ? "received" : "empty", // valid values: "working", "empty", "received", "error"
      requestData: requestData,
      responseData: responseData
    };

    this.runParser = this.runParser.bind(this);
  }

  runParser(event, inputs) {
    this.setState({outputState: "working"});

    const urlStub = this.mode + "-parser-zero";

    var payload = {
      question: inputs.questionValue,
      qrspec: inputs.qrspecValue,
      entitycues: inputs.entitycuesValue
    };
    fetch(`${API_ROOT}/predict/${urlStub}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then((response) => {
      return response.json();
  }).then((json) => {
      // If the response contains a `slug` for a permalink, we want to redirect
      // to the corresponding path using `history.push`.
      const { slug } = json;
    const newPath = slug ? `/${urlStub}/` + slug : `/${urlStub}`;

    // We'll pass the request and response data along as part of the location object
    // so that the `Demo` component can use them to re-render.
    const location = {
      pathname: newPath,
      state: { requestData: payload, responseData: json }
    };
    this.props.history.push(location);
  }).catch((error) => {
      this.setState({outputState: "error"});
    console.error(error);
  });
  }

  render() {
    const { requestData, responseData, mode } = this.props;

    const question = requestData && requestData.question;
    const qrspec = requestData && requestData.qrspec;
    const entitycues = requestData && requestData.entitycues;
    const answer = responseData && responseData.answer;
    const logicalForm = responseData && responseData.logical_form;
    const score = responseData && responseData.score;
    const actions = responseData && responseData.predicted_actions;
    const question_tokens = responseData && responseData.question_tokens;
    const worldExtractions = responseData && responseData.world_extractions;
    const explanation = responseData && responseData.explanation;

    return (
      <div className="pane model">
      <PaneLeft>
      <QuarelInput runParser={this.runParser}
                   outputState={this.state.outputState}
                   mode={mode}
                   question={question}
                   qrspec={qrspec}
                   entitycues={entitycues}/>
      </PaneLeft>
      <PaneRight outputState={this.state.outputState}>
  <QuarelOutput answer={answer}
                logicalForm={logicalForm}
                score={score}
                actions={actions}
                question_tokens={question_tokens}
                worldExtractions={worldExtractions}
                explanation={explanation}
      />
      </PaneRight>
      </div>
  );

  }
}

const QuarelZero = withRouter(_QuarelZero);

export default QuarelZero;
