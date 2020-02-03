import InlineComponent from './abstract/InlineComponent';

export default class TextList extends InlineComponent {
  static componentType = "textlist";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.unordered = { default: false };
    properties.maximumNumber = { default: undefined };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTextlists = childLogic.newLeaf({
      name: "atLeastZeroTextlists",
      componentType: 'textlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoTextsByCommas = function ({ activeChildrenMatched }) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.stateValues.value.split(",").map(x => ({
        componentType: "text",
        state: { value: x.trim() }
      }));
      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atLeastZeroTexts"],
      replacementFunction: breakStringIntoTextsByCommas,
    });

    let textAndTextLists = childLogic.newOperator({
      name: "textAndTextLists",
      operator: "and",
      propositions: [atLeastZeroTexts, atLeastZeroTextlists]
    })

    childLogic.newOperator({
      name: "TextsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, textAndTextLists],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.textAndTextlistChildren = {
      returnDependencies: () => ({
        textAndTextlistChildren: {
          dependencyType: "childIdentity",
          childLogicName: "textAndTextLists",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            textAndTextlistChildren: dependencyValues.textAndTextlistChildren
          }
        }
      }
    }

    stateVariableDefinitions.texts = {
      public: true,
      componentType: "text",
      isArray: true,
      entryPrefixes: ["text"],
      returnDependencies: () => ({
        textAndTextlistChildren: {
          dependencyType: "stateVariable",
          variableName: "textAndTextlistChildren",
        },
        textChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroTexts",
          variableNames: ["value"],
        },
        textlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroTextlists",
          variableNames: ["texts"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let textNumber = 0;
        let textlistNumber = 0;
        let texts = [];

        for (let child of dependencyValues.textAndTextlistChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "text"
          })) {
            texts.push(dependencyValues.textChildren[textNumber].stateValues.value);
            textNumber++;
          } else {
            texts.push(...dependencyValues.textlistChildren[textlistNumber].stateValues.texts);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        return { newValues: { texts } }

      }
    }

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nComponents: dependencyValues.texts.length } }
      }
    }

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        textAndTextlistChildren: {
          dependencyType: "stateVariable",
          variableName: "textAndTextlistChildren",
        },
        textChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroTexts",
        },
        textlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroTextlists",
          variableNames: ["childrenWhoRender"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let textNumber = 0;
        let textlistNumber = 0;
        let childrenWhoRender = [];

        for (let child of dependencyValues.textAndTextlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "text"
          })) {
            childrenWhoRender.push(dependencyValues.textChildren[textNumber].componentName);
            textNumber++;
          } else {
            childrenWhoRender.push(...dependencyValues.textlistChildren[textlistNumber].stateValues.childrenWhoRender);
            textlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenWhoRender = childrenWhoRender.slice(0, maxNum)
        }

        return { newValues: { childrenWhoRender } }

      }
    }
    
    return stateVariableDefinitions;
  }

  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

}