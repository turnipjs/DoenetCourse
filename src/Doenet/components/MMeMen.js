import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export class M extends InlineComponent {
  static componentType = "m";
  static rendererType = "math";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "latex";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroMathlists = childLogic.newLeaf({
      name: "atLeastZeroMathlists",
      componentType: 'mathlist',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroMs = childLogic.newLeaf({
      name: "atLeastZeroMs",
      componentType: 'm',
      comparison: 'atLeast',
      number: 0,
    });
    childLogic.newOperator({
      name: "stringsTextsAndMaths",
      operator: 'and',
      propositions: [
        atLeastZeroStrings,
        atLeastZeroTexts,
        atLeastZeroMaths,
        atLeastZeroMathlists,
        atLeastZeroMs
      ],
      requireConsecutive: true,
      setAsBase: true,
    });
    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.latex = {
      public: true,
      componentType: this.componentType,
      defaultValue: "",
      forRenderer: true,
      returnDependencies: () => ({
        stringTextMathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsTextsAndMaths",
          variableNames: ["latex", "text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.stringTextMathChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              latex: { variablesToCheck: "latex" }
            }
          }
        }

        let latex = "";

        for (let child of dependencyValues.stringTextMathChildren) {
          if (child.stateValues.latex) {
            latex += child.stateValues.latex
          } else if (child.stateValues.text) {
            latex += child.stateValues.text
          }
        }

        return { newValues: { latex } }

      }

    }

    stateVariableDefinitions.renderMode = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { renderMode: "inline" } })
    }


    stateVariableDefinitions.text = {
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues }) {
        let expression;
        try {
          expression = me.fromLatex(dependencyValues.latex);
        } catch (e) {
          // just return latex if can't parse with math-expressions
          return { newValues: { text: dependencyValues.latex } };
        }
        return { newValues: { text: expression.toString() } };
      }
    }

    return stateVariableDefinitions;
  }

}

export class Me extends M {
  static componentType = "me";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      newValues: { renderMode: "display" }
    });
    return stateVariableDefinitions;
  }
}

export class Men extends M {
  static componentType = "men";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      newValues: { renderMode: "numbered" }
    });
    return stateVariableDefinitions;
  }
}


