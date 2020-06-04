describe('LineSegment Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('lineSegment with sugared reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point label='P'>(3,5)</point>
  <point label='Q'>(-4,-1)</point>
    <lineSegment>
      <ref>_point1</ref>
      <ref>_point2</ref>
    </lineSegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('move point P to (5,-5)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: -5 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(5)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-5)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', 5, -5])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-4)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-1)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', -4, -1])
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 5, -5]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', -4, -1]);
    })

    cy.log('move line segment up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
      ];

      let moveX = 3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(p1x)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(p1y)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', p1x, p1y])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(p2x)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(p2y)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', p2x, p2y])
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

    })
  })

  it('lineSegment with sugared string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <lineSegment>(3,5),(-4,9)</lineSegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].activeChildren[0].activeChildren[0];
      let point2 = components["/_linesegment1"].activeChildren[0].activeChildren[1];

      cy.log('Test location')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(point1.stateValues.xs[0].tree).eq(3)
        expect(point1.stateValues.xs[1].tree).eq(5)
        expect(point2.stateValues.xs[0].tree).eq(-4)
        expect(point2.stateValues.xs[1].tree).eq(9)
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 3, 5]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', -4, 9]);

      })

      cy.log('move line segment up and to the left')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
        ];
        let point2coords = [
          components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
        ];

        let moveX = -3;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point1.stateValues.coords.tree).eqls(['vector', p1x, p1y])
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point2.stateValues.coords.tree).eqls(['vector', p2x, p2y])
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

      })
    })
  })

  it('lineSegment with sugared strings and refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment>
  (<ref>_number1</ref>, <ref prop="x">_point1</ref>),
  (<ref prop="y">_point1</ref>, 5)
  </linesegment>
  </graph>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 3, -2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 1, 5]);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-2);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(1);
      expect(components['/_number1'].stateValues.value).eq(3);

    })

    cy.log('move line segment up and to the left')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
      ];

      let moveX = -3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(p1y)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(p2x)
      expect(components['/_number1'].stateValues.value).eq(p1x)
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

    })
  })

  it('lineSegment with endpoints containing sugared strings and refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment><endpoints>
  (<ref>_number1</ref>, <ref prop="x">_point1</ref>),
  (<ref prop="y">_point1</ref>, 5)
  </endpoints></linesegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 3, -2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 1, 5]);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-2);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(1);
      expect(components['/_number1'].stateValues.value).eq(3);

    })

    cy.log('move both ends of line segement')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
      ];

      let moveX = 3;
      let moveY = -2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);

      moveX = -5;
      moveY = 1;
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(p1y);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(p2x);
      expect(components['/_number1'].stateValues.value).eq(p1x);

    })
  })

  it('lineSegment with sugared points containing sugared strings and refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment>
  <point>(<ref>_number1</ref>, <ref prop="x">_point1</ref>)</point>
  <point>(<ref prop="y">_point1</ref>, 5)</point>
  </linesegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('Test location')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 3, -2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 1, 5]);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-2);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(1);
      expect(components['/_number1'].stateValues.value).eq(3);
    })

    cy.log('move both ends of line segement')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
      ];

      let moveX = -1;
      let moveY = 4;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);

      moveX = 2;
      moveY = -6;
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(p1y);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(p2x);
      expect(components['/_number1'].stateValues.value).eq(p1x);

    })
  })

  it('lineSegment with no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <lineSegment><endpoints>
      <point>(-1,2)</point>
      <point>(-2,3)</point>
    </endpoints></lineSegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('move point1 via segment to (-2,-3)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_linesegment1'].moveLineSegment({
        point1coords: [-2, -3],
        point2coords: [-2, 3]
      });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-2)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-3)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', -2, -3])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-2)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(3)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', -2, 3])
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', -2, -3]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', -2, 3]);

    })

    cy.log('move line segment up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
      ];
      let point2coords = [
        components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
        components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
      ];

      let moveX = 3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect(components['/_point1'].stateValues.xs[0].tree).eq(p1x)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(p1y)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', p1x, p1y])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(p2x)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(p2y)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', p2x, p2y])
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

    })
  })

  it('lineSegment with multiple layers of reffed points in sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point>(2,1)</point>
  <point>(-2,-5)</point>
  <ref>_point1</ref>
  <ref>_point2</ref>
  <ref>_ref1</ref>
  <ref>_ref2</ref>
  <ref>_ref3</ref>
  <ref>_ref4</ref>
  
  <graph>
    <lineSegment>
      <ref>_ref5</ref>
      <ref>_ref6</ref>
    </lineSegment>
  </graph>
  <ref prop="y">_point1</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].activeChildren[0].activeChildren[0];
      let point2 = components["/_linesegment1"].activeChildren[0].activeChildren[1];

      cy.log('move point 10 to (0,-3)')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        point2.movePoint({ x: 0, y: -3 });
        expect(point1.stateValues.xs[0].tree).eq(2)
        expect(point1.stateValues.xs[1].tree).eq(1)
        expect(point2.stateValues.xs[0].tree).eq(0)
        expect(point2.stateValues.xs[1].tree).eq(-3)
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 2, 1]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 0, -3]);

      })

      cy.log('move line segment down and to the left')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
        ];
        let point2coords = [
          components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
        ];

        let moveX = -3;
        let moveY = -2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

      })
    })
  })

  it('reffed line segments', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <linesegment><endpoints>
      <point>(-1,2)</point>
      <point>(-2,3)</point>
    </endpoints></linesegment>
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <linesegment>
      <ref>_point3</ref>
      <ref>_point4</ref>
    </linesegment>
    <linesegment>(-9,-1),(-3,6)</linesegment>
  </graph>

  <graph>
    <ref name="ls1a">_linesegment1</ref>
    <ref name="ls2a">_linesegment2</ref>
    <ref name="ls3a">_linesegment3</ref>
  </graph>

  <ref name="g3">_graph2</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ls1a = components["/ls1a"].replacements[0];
      let ls2a = components["/ls2a"].replacements[0];
      let ls3a = components["/ls3a"].replacements[0];
      let lsbs = components["/g3"].replacements[0].activeChildren;

      let linesegment1s = ['/_linesegment1', ls1a.componentName, lsbs[0].componentName];
      let linesegment2s = ['/_linesegment2', ls2a.componentName, lsbs[1].componentName];
      let linesegment3s = ['/_linesegment3', ls3a.componentName, lsbs[2].componentName];

      cy.log("initial state")

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let v1tx = -1;
        let v1ty = 2;
        let v1hx = -2;
        let v1hy = 3;
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;

        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }

      })

      cy.log('move linesegment1')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 5;
        let v1ty = -8;
        let v1hx = 4;
        let v1hy = -9;
        components['/_linesegment1'].moveLineSegment({
          point1coords: [v1tx, v1ty],
          point2coords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment1a')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 2;
        let v1ty = 6;
        let v1hx = -2;
        let v1hy = -4;
        ls1a.moveLineSegment({
          point1coords: [v1tx, v1ty],
          point2coords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment1b')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        lsbs[0].moveLineSegment({
          point1coords: [v1tx, v1ty],
          point2coords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment2')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;

        components['/_linesegment2'].moveLineSegment({
          point1coords: [v2tx, v2ty],
          point2coords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment2a')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = 6;
        let v2ty = -2;
        let v2hx = 1;
        let v2hy = -7;

        ls2a.moveLineSegment({
          point1coords: [v2tx, v2ty],
          point2coords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment2b')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -3;
        let v2ty = -6;
        let v2hx = 5;
        let v2hy = -9;

        lsbs[1].moveLineSegment({
          point1coords: [v2tx, v2ty],
          point2coords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment3')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 6;
        let v3ty = -8;
        let v3hx = -1;
        let v3hy = 0;

        components['/_linesegment3'].moveLineSegment({
          point1coords: [v3tx, v3ty],
          point2coords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment3a')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 3;
        let v3ty = 1;
        let v3hx = -7;
        let v3hy = -2;

        ls3a.moveLineSegment({
          point1coords: [v3tx, v3ty],
          point2coords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move linesegment3b')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = -2;
        let v3ty = 7;
        let v3hx = 5;
        let v3hy = -6;

        lsbs[2].moveLineSegment({
          point1coords: [v3tx, v3ty],
          point2coords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of linesegment1s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect(components[name].stateValues.endpoints[0].tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.endpoints[1].tree).eqls(["vector", v3hx, v3hy]);
        }
      })

    })
  })

  it('initially non-numeric point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="x" prefill="q"/>
  <graph>
    <lineSegment>
      <point>(<ref prop="value">x</ref>,2)</point>
      <point>(-2,3)</point>
    </lineSegment>
  </graph>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', "q", 2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', -2, 3]);
    });

    cy.log('change point to be numeric');
    cy.get('#\\/x_input').clear().type("5{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 5, 2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', -2, 3]);

    })
  })

  it('constrain to linesegment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment><ref>_point1</ref><ref>_point2</ref></linesegment>

  <point>(-5,2)
    <constrainTo><ref>_linesegment1</ref></constrainTo>
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 1, 2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 3, 4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2);
    });

    cy.log('move line segment to 45 degrees')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_linesegment1'].moveLineSegment({
        point1coords: [-4, 4],
        point2coords: [4, -4],
      })
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', -4, 4]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 4, -4]);

      let xorig = -5;
      let yorig = 2;
      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 10;
      let yorig = 1;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 9;
      let yorig = 7;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -9;
      let yorig = 7;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('attract to linesegment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment><ref>_point1</ref><ref>_point2</ref></linesegment>

  <point>(-5,2)
    <attractTo><ref>_linesegment1</ref></attractTo>
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', 1, 2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 3, 4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(-5);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2);
    });

    cy.log('move line segment to 45 degrees')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_linesegment1'].moveLineSegment({
        point1coords: [-4, 4],
        point2coords: [4, -4],
      })
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(['vector', -4, 4]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(['vector', 4, -4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(-5)
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2)
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 3.3;
      let yorig = -3.6;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 4.3;
      let yorig = -4.6;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(4.3, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(-4.6, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -2.4;
      let yorig = 2.8;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -4.2;
      let yorig = 4.3;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('ref endpoints of line segment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment>(1,2),(3,4)</linesegment>
  </graph>
  <graph>
  <ref prop="endpoint1" name="point3">_linesegment1</ref>
  <ref prop="endpoint2" name="point4">_linesegment1</ref>
  </graph>
  <graph>
  <ref prop="endpoints" name="points56">_linesegment1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].activeChildren[0].activeChildren[0];
      let point2 = components["/_linesegment1"].activeChildren[0].activeChildren[1];
      let point3 = components["/point3"].replacements[0]
      let point4 = components["/point4"].replacements[0]
      let point5 = components["/points56"].replacements[0]
      let point6 = components["/points56"].replacements[1]

      cy.window().then((win) => {
        let p1x = 1;
        let p1y = 2;
        let p2x = 3;
        let p2y = 4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move first individually reffed endpoint');
      cy.window().then((win) => {
        let p1x = -2;
        let p1y = -5;
        point3.movePoint({ x: p1x, y: p1y });
        let p2x = 3;
        let p2y = 4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move second individually reffed endpoint');
      cy.window().then((win) => {
        let p2x = 8;
        let p2y = -1;
        point4.movePoint({ x: p2x, y: p2y });
        let p1x = -2;
        let p1y = -5;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move second array-reffed endpoint');
      cy.window().then((win) => {
        let p2x = -6;
        let p2y = 4;
        point6.movePoint({ x: p2x, y: p2y });
        let p1x = -2;
        let p1y = -5;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move first array-reffed endpoint');
      cy.window().then((win) => {
        let p1x = 0;
        let p1y = 7;
        point5.movePoint({ x: p1x, y: p1y });
        let p2x = -6;
        let p2y = 4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move line segment up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
        ];
        let point2coords = [
          components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
        ];

        let moveX = 4;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)

      })
    })

  })

  it('new linesegment from reffed endpoints of line segment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment>(-1,-2),(-3,-4)</linesegment>
  </graph>
  <graph>
  <linesegment>
    <ref prop="endpoints" name="points34">_linesegment1</ref>
  </linesegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].activeChildren[0].activeChildren[0];
      let point2 = components["/_linesegment1"].activeChildren[0].activeChildren[1];
      let point3 = components["/points34"].replacements[0]
      let point4 = components["/points34"].replacements[1]

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let p1x = -1;
        let p1y = -2;
        let p2x = -3;
        let p2y = -4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);
      })

      cy.log('move first line segment up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_linesegment1'].stateValues.endpoints[0].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[0].get_component(1),
        ];
        let point2coords = [
          components['/_linesegment1'].stateValues.endpoints[1].get_component(0),
          components['/_linesegment1'].stateValues.endpoints[1].get_component(1),
        ];

        let moveX = 4;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

      })


      cy.log('move second line segment up and to the left')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_linesegment2'].stateValues.endpoints[0].get_component(0),
          components['/_linesegment2'].stateValues.endpoints[0].get_component(1),
        ];
        let point2coords = [
          components['/_linesegment2'].stateValues.endpoints[1].get_component(0),
          components['/_linesegment2'].stateValues.endpoints[1].get_component(1),
        ];

        let moveX = -7;
        let moveY = 3;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_linesegment2'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });


        moveX = 4 + moveX;
        moveY = 2 + moveY;
        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", p2x, p2y]);

      })
    })

  })

  it('extracting endpoint coordinates of symmetric linesegment', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment>
    <point>(1,2)</point>
    <point>
      (<ref prop="y">_point1</ref>, <ref prop="x">_point1</ref>)
    </point>
  </linesegment> 
  <point name="x1">
    <x><extract prop="x"><ref prop="endpoint1">_linesegment1</ref></extract></x>
    <y fixed>3</y>
  </point>
  <point name="x2">
    <x><extract prop="x"><ref prop="endpoint2">_linesegment1</ref></extract></x>
    <y fixed>4</y>
  </point>
  <point name="y1">
    <y><extract prop="y"><ref prop="endpoint1">_linesegment1</ref></extract></y>
    <x fixed>3</x>
  </point>
  <point name="y2">
    <y><extract prop="y"><ref prop="endpoint2">_linesegment1</ref></extract></y>
    <x fixed>4</x>
  </point>
</graph>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let x = 1, y = 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x, y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move x point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x = 3;
      components['/x1'].movePoint({ x: x });
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x, y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move x point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      y = 4;
      components['/x2'].movePoint({ x: y });
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x, y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move y point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      y = -6;
      components['/y1'].movePoint({ y: y });
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x, y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move y point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x = -8;
      components['/y2'].movePoint({ y: x });
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x, y]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })


  })

  it('three linesegments with mutual references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment>
    <endpoints>
    <ref prop="endpoint2">_linesegment2</ref>
    <point>(1,0)</point>
    </endpoints>
  </linesegment>
  <linesegment>
    <endpoints hide="false">
    <ref prop="endpoint2">_linesegment3</ref>
    <point>(3,2)</point>
    </endpoints>
  </linesegment>
  <linesegment>
    <endpoints hide="false">
    <ref prop="endpoint2">_linesegment1</ref>
    <point>(-1,4)</point>
    </endpoints>
  </linesegment>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components["/_linesegment1"].activeChildren[0].activeChildren[0];
      let point2 = components["/_linesegment1"].activeChildren[0].activeChildren[1];
      let point3 = components["/_linesegment2"].activeChildren[0].activeChildren[1];
      let point4 = components["/_linesegment2"].activeChildren[0].activeChildren[2];
      let point5 = components["/_linesegment3"].activeChildren[0].activeChildren[1];
      let point6 = components["/_linesegment3"].activeChildren[0].activeChildren[2];

      let x1 = 1, y1 = 0;
      let x2 = 3, y2 = 2;
      let x3 = -1, y3 = 4;

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 1 of line segment 1")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        x2 = 7;
        y2 = -3;
        point1.movePoint({ x: x2, y: y2 });
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 2 of line segment 1")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        x1 = -1;
        y1 = -4;
        point2.movePoint({ x: x1, y: y1 });
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 1 of line segment 2")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        x3 = 9;
        y3 = -8;
        point3.movePoint({ x: x3, y: y3 });
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 2 of line segment 2")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        x2 = 3;
        y2 = 2;
        point4.movePoint({ x: x2, y: y2 });
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 1 of line segment 3")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        x1 = -5;
        y1 = 8;
        point5.movePoint({ x: x1, y: y1 });
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 2 of line segment 3")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        x3 = 0;
        y3 = -5;
        point6.movePoint({ x: x3, y: y3 });
        expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment2'].stateValues.endpoints[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_linesegment2'].stateValues.endpoints[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_linesegment3'].stateValues.endpoints[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_linesegment3'].stateValues.endpoints[1].tree).eqls(["vector", x3, y3]);

      })

    })
  })
});