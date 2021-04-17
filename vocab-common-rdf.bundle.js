var SolidRdf = (function (exports) {
  'use strict';

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var BlankNode_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.BlankNode = void 0;
  /**
   * A term that represents an RDF blank node with a label.
   */
  class BlankNode {
      constructor(value) {
          this.termType = 'BlankNode';
          this.value = value;
      }
      equals(other) {
          return !!other && other.termType === 'BlankNode' && other.value === this.value;
      }
  }
  exports.BlankNode = BlankNode;
  //# sourceMappingURL=BlankNode.js.map
  });

  var DefaultGraph_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DefaultGraph = void 0;
  /**
   * A singleton term instance that represents the default graph.
   * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
   */
  class DefaultGraph {
      constructor() {
          this.termType = 'DefaultGraph';
          this.value = '';
          // Private constructor
      }
      equals(other) {
          return !!other && other.termType === 'DefaultGraph';
      }
  }
  exports.DefaultGraph = DefaultGraph;
  DefaultGraph.INSTANCE = new DefaultGraph();
  //# sourceMappingURL=DefaultGraph.js.map
  });

  var NamedNode_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.NamedNode = void 0;
  /**
   * A term that contains an IRI.
   */
  class NamedNode {
      constructor(value) {
          this.termType = 'NamedNode';
          this.value = value;
      }
      equals(other) {
          return !!other && other.termType === 'NamedNode' && other.value === this.value;
      }
  }
  exports.NamedNode = NamedNode;
  //# sourceMappingURL=NamedNode.js.map
  });

  var Literal_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Literal = void 0;

  /**
   * A term that represents an RDF literal, containing a string with an optional language tag or datatype.
   */
  class Literal {
      constructor(value, languageOrDatatype) {
          this.termType = 'Literal';
          this.value = value;
          if (typeof languageOrDatatype === 'string') {
              this.language = languageOrDatatype;
              this.datatype = Literal.RDF_LANGUAGE_STRING;
          }
          else if (languageOrDatatype) {
              this.language = '';
              this.datatype = languageOrDatatype;
          }
          else {
              this.language = '';
              this.datatype = Literal.XSD_STRING;
          }
      }
      equals(other) {
          return !!other && other.termType === 'Literal' && other.value === this.value &&
              other.language === this.language && other.datatype.equals(this.datatype);
      }
  }
  exports.Literal = Literal;
  Literal.RDF_LANGUAGE_STRING = new NamedNode_1.NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
  Literal.XSD_STRING = new NamedNode_1.NamedNode('http://www.w3.org/2001/XMLSchema#string');
  //# sourceMappingURL=Literal.js.map
  });

  var Quad_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Quad = void 0;
  /**
   * An instance of DefaultGraph represents the default graph.
   * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
   */
  class Quad {
      constructor(subject, predicate, object, graph) {
          this.termType = 'Quad';
          this.value = '';
          this.subject = subject;
          this.predicate = predicate;
          this.object = object;
          this.graph = graph;
      }
      equals(other) {
          // `|| !other.termType` is for backwards-compatibility with old factories without RDF* support.
          return !!other && (other.termType === 'Quad' || !other.termType) &&
              this.subject.equals(other.subject) &&
              this.predicate.equals(other.predicate) &&
              this.object.equals(other.object) &&
              this.graph.equals(other.graph);
      }
  }
  exports.Quad = Quad;
  //# sourceMappingURL=Quad.js.map
  });

  var Variable_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Variable = void 0;
  /**
   * A term that represents a variable.
   */
  class Variable {
      constructor(value) {
          this.termType = 'Variable';
          this.value = value;
      }
      equals(other) {
          return !!other && other.termType === 'Variable' && other.value === this.value;
      }
  }
  exports.Variable = Variable;
  //# sourceMappingURL=Variable.js.map
  });

  var DataFactory_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DataFactory = void 0;






  let dataFactoryCounter = 0;
  /**
   * A factory for instantiating RDF terms and quads.
   */
  class DataFactory {
      constructor(options) {
          this.blankNodeCounter = 0;
          options = options || {};
          this.blankNodePrefix = options.blankNodePrefix || `df_${dataFactoryCounter++}_`;
      }
      /**
       * @param value The IRI for the named node.
       * @return A new instance of NamedNode.
       * @see NamedNode
       */
      namedNode(value) {
          return new NamedNode_1.NamedNode(value);
      }
      /**
       * @param value The optional blank node identifier.
       * @return A new instance of BlankNode.
       *         If the `value` parameter is undefined a new identifier
       *         for the blank node is generated for each call.
       * @see BlankNode
       */
      blankNode(value) {
          return new BlankNode_1.BlankNode(value || `${this.blankNodePrefix}${this.blankNodeCounter++}`);
      }
      /**
       * @param value              The literal value.
       * @param languageOrDatatype The optional language or datatype.
       *                           If `languageOrDatatype` is a NamedNode,
       *                           then it is used for the value of `NamedNode.datatype`.
       *                           Otherwise `languageOrDatatype` is used for the value
       *                           of `NamedNode.language`.
       * @return A new instance of Literal.
       * @see Literal
       */
      literal(value, languageOrDatatype) {
          return new Literal_1.Literal(value, languageOrDatatype);
      }
      /**
       * This method is optional.
       * @param value The variable name
       * @return A new instance of Variable.
       * @see Variable
       */
      variable(value) {
          return new Variable_1.Variable(value);
      }
      /**
       * @return An instance of DefaultGraph.
       */
      defaultGraph() {
          return DefaultGraph_1.DefaultGraph.INSTANCE;
      }
      /**
       * @param subject   The quad subject term.
       * @param predicate The quad predicate term.
       * @param object    The quad object term.
       * @param graph     The quad graph term.
       * @return A new instance of Quad.
       * @see Quad
       */
      quad(subject, predicate, object, graph) {
          return new Quad_1.Quad(subject, predicate, object, graph || this.defaultGraph());
      }
      /**
       * Create a deep copy of the given term using this data factory.
       * @param original An RDF term.
       * @return A deep copy of the given term.
       */
      fromTerm(original) {
          // TODO: remove nasty any casts when this TS bug has been fixed:
          //  https://github.com/microsoft/TypeScript/issues/26933
          switch (original.termType) {
              case 'NamedNode':
                  return this.namedNode(original.value);
              case 'BlankNode':
                  return this.blankNode(original.value);
              case 'Literal':
                  if (original.language) {
                      return this.literal(original.value, original.language);
                  }
                  if (!original.datatype.equals(Literal_1.Literal.XSD_STRING)) {
                      return this.literal(original.value, this.fromTerm(original.datatype));
                  }
                  return this.literal(original.value);
              case 'Variable':
                  return this.variable(original.value);
              case 'DefaultGraph':
                  return this.defaultGraph();
              case 'Quad':
                  return this.quad(this.fromTerm(original.subject), this.fromTerm(original.predicate), this.fromTerm(original.object), this.fromTerm(original.graph));
          }
      }
      /**
       * Create a deep copy of the given quad using this data factory.
       * @param original An RDF quad.
       * @return A deep copy of the given quad.
       */
      fromQuad(original) {
          return this.fromTerm(original);
      }
      /**
       * Reset the internal blank node counter.
       */
      resetBlankNodeCounter() {
          this.blankNodeCounter = 0;
      }
  }
  exports.DataFactory = DataFactory;
  //# sourceMappingURL=DataFactory.js.map
  });

  var rdfDataFactory = createCommonjsModule(function (module, exports) {
  var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
  }) : (function(o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
  }));
  var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(BlankNode_1, exports);
  __exportStar(DataFactory_1, exports);
  __exportStar(DefaultGraph_1, exports);
  __exportStar(Literal_1, exports);
  __exportStar(NamedNode_1, exports);
  __exportStar(Quad_1, exports);
  __exportStar(Variable_1, exports);
  //# sourceMappingURL=index.js.map
  });

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$G = new rdfDataFactory.DataFactory();
  function _NS$G(localName) {
      return rdfFactory$G.namedNode("http://schema.org/" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Inrupt extension to Schema.org terms providing
   multilingual alternative names (i.e. labels) and translations for comments
   (e.g. for use directly as labels or tool-tips in user interfaces or error
   messages). This extension very deliberately cherry-picks the individual terms
   from Schema.org that Inrupt currently deem generally useful for Solid and Solid
   applications (meaning we can provide a much cleaner, less noisy and smaller
   bundle size when generating programming language artifacts that provide
   convenient constants for just these selected terms, rather than including the
   over 2,500 terms currently defined in Schema.org).
   */
  var SCHEMA_INRUPT = {
      PREFIX: "schema-inrupt",
      NAMESPACE: "http://schema.org/",
      PREFIX_AND_NAMESPACE: { "schema-inrupt": "http://schema.org/" },
      NS: _NS$G,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A person (alive, dead, undead, or fictional).
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      Person: _NS$G("Person"),
      /**
       * Data type: URL.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      URL: _NS$G("URL"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * An alias for the item.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      alternateName: _NS$G("alternateName"),
      /**
       * Given name. In the U.S., the first name of a Person.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      givenName: _NS$G("givenName"),
      /**
       * Family name. In the U.S., the last name of a Person.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      familyName: _NS$G("familyName"),
      /**
       * An additional name for a Person, can be used for a middle name.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      additionalName: _NS$G("additionalName"),
      /**
       * A license document that applies to this content, typically indicated by URL.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      license: _NS$G("license"),
      /**
       * The name of the item.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      name: _NS$G("name"),
      /**
       * The textual content of this CreativeWork.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      text: _NS$G("text"),
      /**
       * The identifier property represents any kind of identifier for any kind of [[Thing]], such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See [background notes](/docs/datamodel.html#identifierBg) for more details.
            
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * See also:
       *  - https://schema.org/docs/datamodel.html#identifierBg
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      identifier: _NS$G("identifier"),
      /**
       * A description of the item.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      description: _NS$G("description"),
      /**
       * An image of the item. This can be a [[URL]] or a fully described [[ImageObject]].
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * See also:
       *  - https://schema.org/ImageObject
       *  - https://schema.org/URL
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      image: _NS$G("image"),
      /**
       * URL of the item.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      url: _NS$G("url"),
      /**
       * The startTime of something. For a reserved event or service (e.g. FoodEstablishmentReservation), the time that it is expected to start. For actions that span a period of time, when the action was performed. e.g. John wrote a book from *January* to December. For media, including audio and video, it's the time offset of the start of a clip within a larger file.\n\nNote that Event uses startDate/endDate instead of startTime/endTime, even when describing dates with times. This situation may be clarified in future revisions.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      startTime: _NS$G("startTime"),
      /**
       * The endTime of something. For a reserved event or service (e.g. FoodEstablishmentReservation), the time that it is expected to end. For actions that span a period of time, when the action was performed. e.g. John wrote a book from January to *December*. For media, including audio and video, it's the time offset of the end of a clip within a larger file.\n\nNote that Event uses startDate/endDate instead of startTime/endTime, even when describing dates with times. This situation may be clarified in future revisions.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      endTime: _NS$G("endTime"),
      /**
       * Email address.
       *
       * This term has [4] labels and comments, in the languages [de, es, fr, it].
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/schema#
       */
      email: _NS$G("email"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$F = new rdfDataFactory.DataFactory();
  function _NS$F(localName) {
      return rdfFactory$F.namedNode("http://www.w3.org/2006/vcard/ns#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Ontology for vCard based on RFC6350
   */
  var VCARD = {
      PREFIX: "vcard",
      NAMESPACE: "http://www.w3.org/2006/vcard/ns#",
      PREFIX_AND_NAMESPACE: { "vcard": "http://www.w3.org/2006/vcard/ns#" },
      NS: _NS$F,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Acquaintance
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Acquaintance: _NS$F("Acquaintance"),
      /**
       * Used for relation type codes. The URI of the relation type code must be used as the value for the Relation Type.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      RelatedType: _NS$F("RelatedType"),
      /**
       * Agent
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Agent: _NS$F("Agent"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      BBS: _NS$F("BBS"),
      /**
       * Used for telephone type codes. The URI of the telephone type code must be used as the value for the Telephone Type.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      TelephoneType: _NS$F("TelephoneType"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Car: _NS$F("Car"),
      /**
       * Also called mobile telephone
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Cell: _NS$F("Cell"),
      /**
       * Child
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Child: _NS$F("Child"),
      /**
       * Colleague
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Colleague: _NS$F("Colleague"),
      /**
       * Contact
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Contact: _NS$F("Contact"),
      /**
       * Coresident
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Coresident: _NS$F("Coresident"),
      /**
       * Coworker
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Coworker: _NS$F("Coworker"),
      /**
       * Crush
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Crush: _NS$F("Crush"),
      /**
       * Date
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Date: _NS$F("Date"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Dom: _NS$F("Dom"),
      /**
       * Used for type codes. The URI of the type code must be used as the value for Type.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Type: _NS$F("Type"),
      /**
       * Emergency
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Emergency: _NS$F("Emergency"),
      /**
       * Fax
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Fax: _NS$F("Fax"),
      /**
       * Female
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Female: _NS$F("Female"),
      /**
       * Used for gender codes. The URI of the gender code must be used as the value for Gender.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Gender: _NS$F("Gender"),
      /**
       * Friend
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Friend: _NS$F("Friend"),
      /**
       * This implies that the property is related to an individual's personal life
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Home: _NS$F("Home"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      ISDN: _NS$F("ISDN"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Internet: _NS$F("Internet"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Intl: _NS$F("Intl"),
      /**
       * Kin
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Kin: _NS$F("Kin"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Label: _NS$F("Label"),
      /**
       * Male
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Male: _NS$F("Male"),
      /**
       * Me
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Me: _NS$F("Me"),
      /**
       * Met
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Met: _NS$F("Met"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Modem: _NS$F("Modem"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Msg: _NS$F("Msg"),
      /**
       * Muse
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Muse: _NS$F("Muse"),
      /**
       * Neighbor
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Neighbor: _NS$F("Neighbor"),
      /**
       * None
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      None: _NS$F("None"),
      /**
       * Other
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Other: _NS$F("Other"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      PCS: _NS$F("PCS"),
      /**
       * Pager
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Pager: _NS$F("Pager"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Parcel: _NS$F("Parcel"),
      /**
       * Parent
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Parent: _NS$F("Parent"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Postal: _NS$F("Postal"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Pref: _NS$F("Pref"),
      /**
       * Sibling
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Sibling: _NS$F("Sibling"),
      /**
       * Spouse
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Spouse: _NS$F("Spouse"),
      /**
       * Sweetheart
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Sweetheart: _NS$F("Sweetheart"),
      /**
       * This class is deprecated. Use the hasTelephone object property.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Tel: _NS$F("Tel"),
      /**
       * Also called sms telephone
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Text: _NS$F("Text"),
      /**
       * Text phone
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      TextPhone: _NS$F("TextPhone"),
      /**
       * Unknown
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Unknown: _NS$F("Unknown"),
      /**
       * Video
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Video: _NS$F("Video"),
      /**
       * Voice
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Voice: _NS$F("Voice"),
      /**
       * This implies that the property is related to an individual's work place
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Work: _NS$F("Work"),
      /**
       * This class is deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      X400: _NS$F("X400"),
      /**
       * To specify the components of the delivery address for the  object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Address: _NS$F("Address"),
      /**
       * To specify the electronic mail address for communication with the object the vCard represents. Use the hasEmail object property.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Email: _NS$F("Email"),
      /**
       * Object representing a group of persons or entities.  A group object will usually contain hasMember properties to specify the members of the group.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Group: _NS$F("Group"),
      /**
       * The parent class for all objects
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Kind: _NS$F("Kind"),
      /**
       * An object representing a single person or entity
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Individual: _NS$F("Individual"),
      /**
       * An object representing a named geographical place
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Location: _NS$F("Location"),
      /**
       * An object representing an organization.  An organization is a single entity, and might represent a business or government, a department or division within a business or government, a club, an association, or the like.
    
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Organization: _NS$F("Organization"),
      /**
       * To specify the components of the name of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      Name: _NS$F("Name"),
      /**
       * The vCard class is  equivalent to the new Kind class, which is the parent for the four explicit types of vCards (Individual, Organization, Location, Group)
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      VCard: _NS$F("VCard"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      adr: _NS$F("adr"),
      /**
       * To specify the components of the delivery address for the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasAddress: _NS$F("hasAddress"),
      /**
       * This object property has been deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      agent: _NS$F("agent"),
      /**
       * The date of marriage, or equivalent, of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      anniversary: _NS$F("anniversary"),
      /**
       * To specify the birth date of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      bday: _NS$F("bday"),
      /**
       * The category information about the object, also known as tags
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      category: _NS$F("category"),
      /**
       * This data property has been deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      class: _NS$F("class"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      email: _NS$F("email"),
      /**
       * To specify the electronic mail address for communication with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasEmail: _NS$F("hasEmail"),
      /**
       * This data property has been deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      extended_address: _NS$F("extended-address"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      geo: _NS$F("geo"),
      /**
       * To specify information related to the global positioning of the object. May also be used as a property parameter.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasGeo: _NS$F("hasGeo"),
      /**
       * Used to support property parameters for the additional name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasAdditionalName: _NS$F("hasAdditionalName"),
      /**
       * To specify the busy time associated with the object. (Was called FBURL in RFC6350)
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasCalendarBusy: _NS$F("hasCalendarBusy"),
      /**
       * To specify the calendar associated with the object. (Was called CALURI in RFC6350)
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasCalendarLink: _NS$F("hasCalendarLink"),
      /**
       * To specify the calendar user address to which a scheduling request be sent for the object. (Was called CALADRURI in RFC6350)
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasCalendarRequest: _NS$F("hasCalendarRequest"),
      /**
       * Used to support property parameters for the category data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasCategory: _NS$F("hasCategory"),
      /**
       * Used to support property parameters for the country name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasCountryName: _NS$F("hasCountryName"),
      /**
       * Used to support property parameters for the formatted name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasFN: _NS$F("hasFN"),
      /**
       * Used to support property parameters for the family name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasFamilyName: _NS$F("hasFamilyName"),
      /**
       * To specify  the sex or gender identity of the object. URIs are recommended to enable interoperable sex and gender codes to be used.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasGender: _NS$F("hasGender"),
      /**
       * Used to support property parameters for the given name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasGivenName: _NS$F("hasGivenName"),
      /**
       * Used to support property parameters for the honorific prefix data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasHonorificPrefix: _NS$F("hasHonorificPrefix"),
      /**
       * Used to support property parameters for the honorific suffix data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasHonorificSuffix: _NS$F("hasHonorificSuffix"),
      /**
       * To specify the instant messaging and presence protocol communications with the object. (Was called IMPP in RFC6350)
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasInstantMessage: _NS$F("hasInstantMessage"),
      /**
       * Used to support property parameters for the language data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasLanguage: _NS$F("hasLanguage"),
      /**
       * Used to support property parameters for the locality data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasLocality: _NS$F("hasLocality"),
      /**
       * Used to support property parameters for the nickname data property
       *
       * See also:
       *  - http://www.w3.org/2006/vcard/ns#nickname
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasNickname: _NS$F("hasNickname"),
      /**
       * The nick name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      nickname: _NS$F("nickname"),
      /**
       * Used to support property parameters for the note data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasNote: _NS$F("hasNote"),
      /**
       * Used to support property parameters for the organization name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasOrganizationName: _NS$F("hasOrganizationName"),
      /**
       * Used to support property parameters for the organization unit name data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasOrganizationUnit: _NS$F("hasOrganizationUnit"),
      /**
       * Used to support property parameters for the postal code data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasPostalCode: _NS$F("hasPostalCode"),
      /**
       * Used to support property parameters for the region data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasRegion: _NS$F("hasRegion"),
      /**
       * To specify a relationship between another entity and the entity represented by this object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasRelated: _NS$F("hasRelated"),
      /**
       * Used to support property parameters for the role data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasRole: _NS$F("hasRole"),
      /**
       * To identify the source of directory information of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasSource: _NS$F("hasSource"),
      /**
       * Used to support property parameters for the street address data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasStreetAddress: _NS$F("hasStreetAddress"),
      /**
       * Used to support property parameters for the title data property
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasTitle: _NS$F("hasTitle"),
      /**
       * To specify a value that represents a globally unique identifier corresponding to the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasUID: _NS$F("hasUID"),
      /**
       * Used to indicate the resource value of an object property that requires property parameters
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasValue: _NS$F("hasValue"),
      /**
       * This data property has been deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      label: _NS$F("label"),
      /**
       * To specify the language that may be used for contacting the object. May also be used as a property parameter.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      language: _NS$F("language"),
      /**
       * This data property has been deprecated. See hasGeo
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      latitude: _NS$F("latitude"),
      /**
       * This data property has been deprecated. See hasGeo
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      longitude: _NS$F("longitude"),
      /**
       * This data property has been deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      mailer: _NS$F("mailer"),
      /**
       * A note associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      note: _NS$F("note"),
      /**
       * This object property has been mapped. Use the organization-name data property.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      org: _NS$F("org"),
      /**
       * To specify the organizational name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      organization_name: _NS$F("organization-name"),
      /**
       * To specify the organizational unit name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      organization_unit: _NS$F("organization-unit"),
      /**
       * This data property has been deprecated
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      post_office_box: _NS$F("post-office-box"),
      /**
       * To specify the identifier for the product that created the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      prodid: _NS$F("prodid"),
      /**
       * To specify revision information about the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      rev: _NS$F("rev"),
      /**
       * To specify the function or part played in a particular situation by the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      role: _NS$F("role"),
      /**
       * To specify the string to be used for national-language-specific sorting. Used as a property parameter only.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      sort_string: _NS$F("sort-string"),
      /**
       * To specify the position or job of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      title: _NS$F("title"),
      /**
       * To indicate time zone information that is specific to the object. May also be used as a property parameter.
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      tz: _NS$F("tz"),
      /**
       * Used to indicate the literal value of a data property that requires property parameters
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      value: _NS$F("value"),
      /**
       * The country name associated with the address of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      country_name: _NS$F("country-name"),
      /**
       * The locality (e.g. city or town) associated with the address of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      locality: _NS$F("locality"),
      /**
       * The postal code associated with the address of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      postal_code: _NS$F("postal-code"),
      /**
       * The region (e.g. state or province) associated with the address of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      region: _NS$F("region"),
      /**
       * The street address associated with the address of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      street_address: _NS$F("street-address"),
      /**
       * To include a member in the group this object represents. (This property can only be used by Group individuals)
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasMember: _NS$F("hasMember"),
      /**
       * The additional name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      additional_name: _NS$F("additional-name"),
      /**
       * The family name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      family_name: _NS$F("family-name"),
      /**
       * The given name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      given_name: _NS$F("given-name"),
      /**
       * The honorific prefix of the name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      honorific_prefix: _NS$F("honorific-prefix"),
      /**
       * The honorific suffix of the name associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      honorific_suffix: _NS$F("honorific-suffix"),
      /**
       * The formatted text corresponding to the name of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      fn: _NS$F("fn"),
      /**
       * To specify a public key or authentication certificate associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasKey: _NS$F("hasKey"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      key: _NS$F("key"),
      /**
       * To specify a graphic image of a logo associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasLogo: _NS$F("hasLogo"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      logo: _NS$F("logo"),
      /**
       * To specify the components of the name of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasName: _NS$F("hasName"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      n: _NS$F("n"),
      /**
       * To specify an image or photograph information that annotates some aspect of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasPhoto: _NS$F("hasPhoto"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      photo: _NS$F("photo"),
      /**
       * To specify a digital sound content information that annotates some aspect of the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasSound: _NS$F("hasSound"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      sound: _NS$F("sound"),
      /**
       * To specify the telephone number for telephony communication with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasTelephone: _NS$F("hasTelephone"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      tel: _NS$F("tel"),
      /**
       * To specify a uniform resource locator associated with the object
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      hasURL: _NS$F("hasURL"),
      /**
       * This object property has been mapped
       *
       * Defined by the vocabulary: http://www.w3.org/2006/vcard/ns
       */
      url: _NS$F("url"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$E = new rdfDataFactory.DataFactory();
  function _NS$E(localName) {
      return rdfFactory$E.namedNode("http://www.w3.org/2006/vcard/ns#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Ontology for vCard based on RFC6350
   */
  var VCARD_INRUPT = {
      PREFIX: "vcard-inrupt",
      NAMESPACE: "http://www.w3.org/2006/vcard/ns#",
      PREFIX_AND_NAMESPACE: { "vcard-inrupt": "http://www.w3.org/2006/vcard/ns#" },
      NS: _NS$E,
      // *******************
      // All the Properties.
      // *******************
      /**
       * To specify the components of the delivery address for the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      hasAddress: _NS$E("hasAddress"),
      /**
       * To specify the electronic mail address for communication with the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      hasEmail: _NS$E("hasEmail"),
      /**
       * To specify the telephone number for telephony communication with the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      hasTelephone: _NS$E("hasTelephone"),
      /**
       * The formatted text corresponding to the name of the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      fn: _NS$E("fn"),
      /**
       * To specify the function or part played in a particular situation by the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      role: _NS$E("role"),
      /**
       * To specify the organizational name associated with the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      organization_name: _NS$E("organization-name"),
      /**
       * The street address associated with the address of the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      street_address: _NS$E("street-address"),
      /**
       * The locality (e.g. city or town) associated with the address of the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      locality: _NS$E("locality"),
      /**
       * The postal code associated with the address of the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      postal_code: _NS$E("postal-code"),
      /**
       * The region (e.g. state or province) associated with the address of the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      region: _NS$E("region"),
      /**
       * The country name associated with the address of the object
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/vcard#
       */
      country_name: _NS$E("country-name"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$D = new rdfDataFactory.DataFactory();
  function _NS$D(localName) {
      return rdfFactory$D.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - RDF (Resource Description Framework) - a framework for representing information in the Web
   */
  var RDF = {
      PREFIX: "rdf",
      NAMESPACE: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      PREFIX_AND_NAMESPACE: { "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
      NS: _NS$D,
      // *****************
      // All the Classes.
      // *****************
      /**
       * The datatype of RDF literals storing fragments of HTML content
       *
       * See also:
       *  - http://www.w3.org/TR/rdf11-concepts/#section-html
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      HTML: _NS$D("HTML"),
      /**
       * The datatype of language-tagged string values
       *
       * See also:
       *  - http://www.w3.org/TR/rdf11-concepts/#section-Graph-Literal
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      langString: _NS$D("langString"),
      /**
       * The class of plain (i.e. untyped) literal values, as used in RIF and OWL 2
       *
       * See also:
       *  - http://www.w3.org/TR/rdf-plain-literal/
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      PlainLiteral: _NS$D("PlainLiteral"),
      /**
       * The class of RDF properties.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      Property: _NS$D("Property"),
      /**
       * The class of RDF statements.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      Statement: _NS$D("Statement"),
      /**
       * The class of unordered containers.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      Bag: _NS$D("Bag"),
      /**
       * The class of ordered containers.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      Seq: _NS$D("Seq"),
      /**
       * The class of containers of alternatives.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      Alt: _NS$D("Alt"),
      /**
       * The class of RDF Lists.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      List: _NS$D("List"),
      /**
       * The datatype of XML literal values.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      XMLLiteral: _NS$D("XMLLiteral"),
      /**
       * The datatype of RDF literals storing JSON content.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#the-rdf-json-datatype
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      JSON: _NS$D("JSON"),
      /**
       * A class representing a compound literal.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#the-rdf-compoundliteral-class-and-the-rdf-language-and-rdf-direction-properties
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      CompoundLiteral: _NS$D("CompoundLiteral"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The subject is an instance of a class.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      type: _NS$D("type"),
      /**
       * The subject of the subject RDF statement.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      subject: _NS$D("subject"),
      /**
       * The predicate of the subject RDF statement.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      predicate: _NS$D("predicate"),
      /**
       * The object of the subject RDF statement.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      object: _NS$D("object"),
      /**
       * Idiomatic property used for structured values.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      value: _NS$D("value"),
      /**
       * The empty list, with no items in it. If the rest of a list is nil then the list has no more items in it.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      nil: _NS$D("nil"),
      /**
       * The first item in the subject RDF list.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      first: _NS$D("first"),
      /**
       * The rest of the subject RDF list after the first item.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      rest: _NS$D("rest"),
      /**
       * The language component of a CompoundLiteral.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#the-rdf-compoundliteral-class-and-the-rdf-language-and-rdf-direction-properties
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      language: _NS$D("language"),
      /**
       * The base direction component of a CompoundLiteral.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#the-rdf-compoundliteral-class-and-the-rdf-language-and-rdf-direction-properties
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      direction: _NS$D("direction"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$C = new rdfDataFactory.DataFactory();
  function _NS$C(localName) {
      return rdfFactory$C.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - RDF (Resource Description Framework) - with extensions (e.g., translations of labels or comments, etc.) from Inrupt
   */
  var RDF_INRUPT = {
      PREFIX: "rdf-inrupt",
      NAMESPACE: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      PREFIX_AND_NAMESPACE: { "rdf-inrupt": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
      NS: _NS$C,
      // *******************
      // All the Properties.
      // *******************
      /**
       * The subject is an instance of a class.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/1999/02/22-rdf-syntax-ns#
       */
      type: _NS$C("type"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$B = new rdfDataFactory.DataFactory();
  function _NS$B(localName) {
      return rdfFactory$B.namedNode("http://www.w3.org/2000/01/rdf-schema#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - RDFS (RDF Schema) - a data-modelling vocabulary for RDF data
   */
  var RDFS = {
      PREFIX: "rdfs",
      NAMESPACE: "http://www.w3.org/2000/01/rdf-schema#",
      PREFIX_AND_NAMESPACE: { "rdfs": "http://www.w3.org/2000/01/rdf-schema#" },
      NS: _NS$B,
      // *****************
      // All the Classes.
      // *****************
      /**
       * The class resource, everything.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      Resource: _NS$B("Resource"),
      /**
       * The class of classes.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      Class: _NS$B("Class"),
      /**
       * The class of literal values, eg. textual strings and integers.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      Literal: _NS$B("Literal"),
      /**
       * The class of RDF containers.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      Container: _NS$B("Container"),
      /**
       * The class of container membership properties, rdf:_1, rdf:_2, ...,
                        all of which are sub-properties of 'member'.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      ContainerMembershipProperty: _NS$B("ContainerMembershipProperty"),
      /**
       * The class of RDF datatypes.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      Datatype: _NS$B("Datatype"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The defininition of the subject resource.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      isDefinedBy: _NS$B("isDefinedBy"),
      /**
       * A human-readable name for the subject.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      label: _NS$B("label"),
      /**
       * A description of the subject resource.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      comment: _NS$B("comment"),
      /**
       * The subject is a subclass of a class.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      subClassOf: _NS$B("subClassOf"),
      /**
       * A range of the subject property.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      range: _NS$B("range"),
      /**
       * A domain of the subject property.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      domain: _NS$B("domain"),
      /**
       * The subject is a subproperty of a property.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      subPropertyOf: _NS$B("subPropertyOf"),
      /**
       * Further information about the subject resource.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      seeAlso: _NS$B("seeAlso"),
      /**
       * A member of the subject resource.
       *
       * Defined by the vocabulary: http://www.w3.org/2000/01/rdf-schema#
       */
      member: _NS$B("member"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$A = new rdfDataFactory.DataFactory();
  function _NS$A(localName) {
      return rdfFactory$A.namedNode("http://www.w3.org/2001/XMLSchema#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * A vocabulary for describing XML Schema datatypes.
   */
  var XSD = {
      PREFIX: "xsd",
      NAMESPACE: "http://www.w3.org/2001/XMLSchema#",
      PREFIX_AND_NAMESPACE: { "xsd": "http://www.w3.org/2001/XMLSchema#" },
      NS: _NS$A,
      // *******************
      // All the Properties.
      // *******************
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      changes: _NS$A("changes"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      string: _NS$A("string"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      boolean: _NS$A("boolean"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      float: _NS$A("float"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      double: _NS$A("double"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      decimal: _NS$A("decimal"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      dateTime: _NS$A("dateTime"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      duration: _NS$A("duration"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      hexBinary: _NS$A("hexBinary"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      base64Binary: _NS$A("base64Binary"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      anyURI: _NS$A("anyURI"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      ID: _NS$A("ID"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      IDREF: _NS$A("IDREF"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      ENTITY: _NS$A("ENTITY"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      NOTATION: _NS$A("NOTATION"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      normalizedString: _NS$A("normalizedString"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      token: _NS$A("token"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      language: _NS$A("language"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      IDREFS: _NS$A("IDREFS"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      ENTITIES: _NS$A("ENTITIES"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      NMTOKEN: _NS$A("NMTOKEN"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      NMTOKENS: _NS$A("NMTOKENS"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      Name: _NS$A("Name"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      QName: _NS$A("QName"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      NCName: _NS$A("NCName"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      integer: _NS$A("integer"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      nonNegativeInteger: _NS$A("nonNegativeInteger"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      positiveInteger: _NS$A("positiveInteger"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      nonPositiveInteger: _NS$A("nonPositiveInteger"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      negativeInteger: _NS$A("negativeInteger"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      byte: _NS$A("byte"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      int: _NS$A("int"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      long: _NS$A("long"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      short: _NS$A("short"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      unsignedByte: _NS$A("unsignedByte"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      unsignedInt: _NS$A("unsignedInt"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      unsignedLong: _NS$A("unsignedLong"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      unsignedShort: _NS$A("unsignedShort"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      date: _NS$A("date"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      time: _NS$A("time"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      gYearMonth: _NS$A("gYearMonth"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      gYear: _NS$A("gYear"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      gMonthDay: _NS$A("gMonthDay"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      gDay: _NS$A("gDay"),
      /**
       * .
       *
       * Defined by the vocabulary: http://www.w3.org/2001/XMLSchema#
       */
      gMonth: _NS$A("gMonth"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$z = new rdfDataFactory.DataFactory();
  function _NS$z(localName) {
      return rdfFactory$z.namedNode("http://www.w3.org/2002/07/owl#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   *
    This ontology partially describes the built-in classes and
    properties that together form the basis of the RDF/XML syntax of OWL 2.
    The content of this ontology is based on Tables 6.1 and 6.2
    in Section 6.4 of the OWL 2 RDF-Based Semantics specification,
    available at http://www.w3.org/TR/owl2-rdf-based-semantics/.
    Please note that those tables do not include the different annotations
    (labels, comments and rdfs:isDefinedBy links) used in this file.
    Also note that the descriptions provided in this ontology do not
    provide a complete and correct formal description of either the syntax
    or the semantics of the introduced terms (please see the OWL 2
    recommendations for the complete and normative specifications).
    Furthermore, the information provided by this ontology may be
    misleading if not used with care. This ontology SHOULD NOT be imported
    into OWL ontologies. Importing this file into an OWL 2 DL ontology
    will cause it to become an OWL 2 Full ontology and may have other,
    unexpected, consequences.
     
   */
  var OWL = {
      PREFIX: "owl",
      NAMESPACE: "http://www.w3.org/2002/07/owl#",
      PREFIX_AND_NAMESPACE: { "owl": "http://www.w3.org/2002/07/owl#" },
      NS: _NS$z,
      // *****************
      // All the Classes.
      // *****************
      /**
       * The class of ontologies.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Ontology: _NS$z("Ontology"),
      /**
       * The class of collections of pairwise different individuals.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      AllDifferent: _NS$z("AllDifferent"),
      /**
       * The class of collections of pairwise disjoint classes.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      AllDisjointClasses: _NS$z("AllDisjointClasses"),
      /**
       * The class of collections of pairwise disjoint properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      AllDisjointProperties: _NS$z("AllDisjointProperties"),
      /**
       * The class of annotated annotations for which the RDF serialization consists of an annotated subject, predicate and object.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Annotation: _NS$z("Annotation"),
      /**
       * The class of annotation properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      AnnotationProperty: _NS$z("AnnotationProperty"),
      /**
       * The class of asymmetric properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      AsymmetricProperty: _NS$z("AsymmetricProperty"),
      /**
       * The class of object properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      ObjectProperty: _NS$z("ObjectProperty"),
      /**
       * The class of annotated axioms for which the RDF serialization consists of an annotated subject, predicate and object.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Axiom: _NS$z("Axiom"),
      /**
       * The class of OWL classes.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Class: _NS$z("Class"),
      /**
       * The class of OWL data ranges, which are special kinds of datatypes. Note: The use of the IRI owl:DataRange has been deprecated as of OWL 2. The IRI rdfs:Datatype SHOULD be used instead.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      DataRange: _NS$z("DataRange"),
      /**
       * The class of data properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      DatatypeProperty: _NS$z("DatatypeProperty"),
      /**
       * The class of deprecated classes.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      DeprecatedClass: _NS$z("DeprecatedClass"),
      /**
       * The class of deprecated properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      DeprecatedProperty: _NS$z("DeprecatedProperty"),
      /**
       * The class of functional properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      FunctionalProperty: _NS$z("FunctionalProperty"),
      /**
       * The class of inverse-functional properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      InverseFunctionalProperty: _NS$z("InverseFunctionalProperty"),
      /**
       * The class of irreflexive properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      IrreflexiveProperty: _NS$z("IrreflexiveProperty"),
      /**
       * The class of named individuals.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      NamedIndividual: _NS$z("NamedIndividual"),
      /**
       * The class of OWL individuals.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Thing: _NS$z("Thing"),
      /**
       * The class of negative property assertions.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      NegativePropertyAssertion: _NS$z("NegativePropertyAssertion"),
      /**
       * This is the empty class.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Nothing: _NS$z("Nothing"),
      /**
       * The class of ontology properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      OntologyProperty: _NS$z("OntologyProperty"),
      /**
       * The class of reflexive properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      ReflexiveProperty: _NS$z("ReflexiveProperty"),
      /**
       * The class of property restrictions.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      Restriction: _NS$z("Restriction"),
      /**
       * The class of symmetric properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      SymmetricProperty: _NS$z("SymmetricProperty"),
      /**
       * The class of transitive properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      TransitiveProperty: _NS$z("TransitiveProperty"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The annotation property that provides version information for an ontology or another OWL construct.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      versionInfo: _NS$z("versionInfo"),
      /**
       * The property that determines the class that a universal property restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      allValuesFrom: _NS$z("allValuesFrom"),
      /**
       * The property that determines the predicate of an annotated axiom or annotated annotation.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      annotatedProperty: _NS$z("annotatedProperty"),
      /**
       * The property that determines the subject of an annotated axiom or annotated annotation.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      annotatedSource: _NS$z("annotatedSource"),
      /**
       * The property that determines the object of an annotated axiom or annotated annotation.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      annotatedTarget: _NS$z("annotatedTarget"),
      /**
       * The property that determines the predicate of a negative property assertion.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      assertionProperty: _NS$z("assertionProperty"),
      /**
       * The annotation property that indicates that a given ontology is backward compatible with another ontology.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      backwardCompatibleWith: _NS$z("backwardCompatibleWith"),
      /**
       * The data property that does not relate any individual to any data value.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      bottomDataProperty: _NS$z("bottomDataProperty"),
      /**
       * The object property that does not relate any two individuals.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      bottomObjectProperty: _NS$z("bottomObjectProperty"),
      /**
       * The property that determines the cardinality of an exact cardinality restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      cardinality: _NS$z("cardinality"),
      /**
       * The property that determines that a given class is the complement of another class.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      complementOf: _NS$z("complementOf"),
      /**
       * The property that determines that a given data range is the complement of another data range with respect to the data domain.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      datatypeComplementOf: _NS$z("datatypeComplementOf"),
      /**
       * The annotation property that indicates that a given entity has been deprecated.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      deprecated: _NS$z("deprecated"),
      /**
       * The property that determines that two given individuals are different.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      differentFrom: _NS$z("differentFrom"),
      /**
       * The property that determines that a given class is equivalent to the disjoint union of a collection of other classes.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      disjointUnionOf: _NS$z("disjointUnionOf"),
      /**
       * The property that determines that two given classes are disjoint.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      disjointWith: _NS$z("disjointWith"),
      /**
       * The property that determines the collection of pairwise different individuals in a owl:AllDifferent axiom.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      distinctMembers: _NS$z("distinctMembers"),
      /**
       * The property that determines that two given classes are equivalent, and that is used to specify datatype definitions.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      equivalentClass: _NS$z("equivalentClass"),
      /**
       * The property that determines that two given properties are equivalent.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      equivalentProperty: _NS$z("equivalentProperty"),
      /**
       * The property that determines the collection of properties that jointly build a key.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      hasKey: _NS$z("hasKey"),
      /**
       * The property that determines the property that a self restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      hasSelf: _NS$z("hasSelf"),
      /**
       * The property that determines the individual that a has-value restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      hasValue: _NS$z("hasValue"),
      /**
       * The annotation property that indicates that a given ontology is incompatible with another ontology.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      incompatibleWith: _NS$z("incompatibleWith"),
      /**
       * The property that determines the collection of classes or data ranges that build an intersection.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      intersectionOf: _NS$z("intersectionOf"),
      /**
       * The property that determines that two given properties are inverse.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      inverseOf: _NS$z("inverseOf"),
      /**
       * The property that determines the cardinality of a maximum cardinality restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      maxCardinality: _NS$z("maxCardinality"),
      /**
       * The property that determines the cardinality of a maximum qualified cardinality restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      maxQualifiedCardinality: _NS$z("maxQualifiedCardinality"),
      /**
       * The property that determines the collection of members in either a owl:AllDifferent, owl:AllDisjointClasses or owl:AllDisjointProperties axiom.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      members: _NS$z("members"),
      /**
       * The property that determines the cardinality of a minimum cardinality restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      minCardinality: _NS$z("minCardinality"),
      /**
       * The property that determines the cardinality of a minimum qualified cardinality restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      minQualifiedCardinality: _NS$z("minQualifiedCardinality"),
      /**
       * The property that determines the class that a qualified object cardinality restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      onClass: _NS$z("onClass"),
      /**
       * The property that determines the data range that a qualified data cardinality restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      onDataRange: _NS$z("onDataRange"),
      /**
       * The property that determines the datatype that a datatype restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      onDatatype: _NS$z("onDatatype"),
      /**
       * The property that determines the collection of individuals or data values that build an enumeration.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      oneOf: _NS$z("oneOf"),
      /**
       * The property that determines the n-tuple of properties that a property restriction on an n-ary data range refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      onProperties: _NS$z("onProperties"),
      /**
       * The property that determines the property that a property restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      onProperty: _NS$z("onProperty"),
      /**
       * The annotation property that indicates the predecessor ontology of a given ontology.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      priorVersion: _NS$z("priorVersion"),
      /**
       * The property that determines the n-tuple of properties that build a sub property chain of a given property.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      propertyChainAxiom: _NS$z("propertyChainAxiom"),
      /**
       * The property that determines that two given properties are disjoint.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      propertyDisjointWith: _NS$z("propertyDisjointWith"),
      /**
       * The property that determines the cardinality of an exact qualified cardinality restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      qualifiedCardinality: _NS$z("qualifiedCardinality"),
      /**
       * The property that determines that two given individuals are equal.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      sameAs: _NS$z("sameAs"),
      /**
       * The property that determines the class that an existential property restriction refers to.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      someValuesFrom: _NS$z("someValuesFrom"),
      /**
       * The property that determines the subject of a negative property assertion.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      sourceIndividual: _NS$z("sourceIndividual"),
      /**
       * The property that determines the object of a negative object property assertion.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      targetIndividual: _NS$z("targetIndividual"),
      /**
       * The property that determines the value of a negative data property assertion.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      targetValue: _NS$z("targetValue"),
      /**
       * The data property that relates every individual to every data value.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      topDataProperty: _NS$z("topDataProperty"),
      /**
       * The object property that relates every two individuals.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      topObjectProperty: _NS$z("topObjectProperty"),
      /**
       * The property that determines the collection of classes or data ranges that build a union.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      unionOf: _NS$z("unionOf"),
      /**
       * The property that determines the collection of facet-value pairs that define a datatype restriction.
       *
       * Defined by the vocabulary: http://www.w3.org/2002/07/owl#
       */
      withRestrictions: _NS$z("withRestrictions"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$y = new rdfDataFactory.DataFactory();
  function _NS$y(localName) {
      return rdfFactory$y.namedNode("http://www.w3.org/ns/ldp#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Vocabulary URIs defined in the Linked Data Platform (LDP) namespace.
   */
  var LDP = {
      PREFIX: "ldp",
      NAMESPACE: "http://www.w3.org/ns/ldp#",
      PREFIX_AND_NAMESPACE: { "ldp": "http://www.w3.org/ns/ldp#" },
      NS: _NS$y,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A HTTP-addressable resource whose lifecycle is managed by a LDP server.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      Resource: _NS$y("Resource"),
      /**
       * A Linked Data Platform Resource (LDPR) whose state is represented as RDF.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      RDFSource: _NS$y("RDFSource"),
      /**
       * A Linked Data Platform Resource (LDPR) whose state is NOT represented as RDF.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      NonRDFSource: _NS$y("NonRDFSource"),
      /**
       * A Linked Data Platform RDF Source (LDP-RS) that also conforms to additional patterns and conventions for managing membership. Readers should refer to the specification defining this ontology for the list of behaviors associated with it.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      Container: _NS$y("Container"),
      /**
       * An LDPC that uses a predefined predicate to simply link to its contained resources.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      BasicContainer: _NS$y("BasicContainer"),
      /**
       * An LDPC that is similar to a LDP-DC but it allows an indirection with the ability to list as member a resource, such as a URI representing a real-world object, that is different from the resource that is created.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      DirectContainer: _NS$y("DirectContainer"),
      /**
       * An LDPC that has the flexibility of choosing what form the membership triples take.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      IndirectContainer: _NS$y("IndirectContainer"),
      /**
       * URI signifying that the resource is an in-sequence page resource, as defined by LDP Paging.  Typically used on Link rel='type' response headers.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      Page: _NS$y("Page"),
      /**
       * Element in the list of sorting criteria used by the server to assign container members to pages.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      PageSortCriterion: _NS$y("PageSortCriterion"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Indicates which predicate is used in membership triples, and that the membership triple pattern is < membership-constant-URI , object-of-hasMemberRelation, member-URI >.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      hasMemberRelation: _NS$y("hasMemberRelation"),
      /**
       * Indicates which predicate is used in membership triples, and that the membership triple pattern is < member-URI , object-of-isMemberOfRelation, membership-constant-URI >.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      isMemberOfRelation: _NS$y("isMemberOfRelation"),
      /**
       * Indicates the membership-constant-URI in a membership triple.  Depending upon the membership triple pattern a container uses, as indicated by the presence of ldp:hasMemberRelation or ldp:isMemberOfRelation, the membership-constant-URI might occupy either the subject or object position in membership triples.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      membershipResource: _NS$y("membershipResource"),
      /**
       * Indicates which triple in a creation request should be used as the member-URI value in the membership triple added when the creation request is successful.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      insertedContentRelation: _NS$y("insertedContentRelation"),
      /**
       * LDP servers should use this predicate as the membership predicate if there is no obvious predicate from an application vocabulary to use.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      member: _NS$y("member"),
      /**
       * Links a container with resources created through the container.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      contains: _NS$y("contains"),
      /**
       * Links a resource with constraints that the server requires requests like creation and update to conform to.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      constrainedBy: _NS$y("constrainedBy"),
      /**
       * Link to the list of sorting criteria used by the server in a representation.  Typically used on Link response headers as an extension link relation URI in the rel= parameter.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortCriteria: _NS$y("pageSortCriteria"),
      /**
       * Predicate used to specify the order of the members across a page sequence's in-sequence page resources; it asserts nothing about the order of members in the representation of a single page.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortPredicate: _NS$y("pageSortPredicate"),
      /**
       * The ascending/descending/etc order used to order the members across pages in a page sequence.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortOrder: _NS$y("pageSortOrder"),
      /**
       * The collation used to order the members across pages in a page sequence when comparing strings.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortCollation: _NS$y("pageSortCollation"),
      /**
       * Link to a page sequence resource, as defined by LDP Paging.  Typically used to communicate the sorting criteria used to allocate LDPC members to pages.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSequence: _NS$y("pageSequence"),
      /**
       * Links a resource to a container where notifications for the resource can be created and discovered.
       *
       * Defined by the vocabulary: https://www.w3.org/TR/ldn/
       */
      inbox: _NS$y("inbox"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$x = new rdfDataFactory.DataFactory();
  function _NS$x(localName) {
      return rdfFactory$x.namedNode("http://www.w3.org/ns/ldp#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Vocabulary URIs defined in the Linked Data Platform (LDP) namespace.
   */
  var LDP_INRUPT = {
      PREFIX: "ldp-inrupt",
      NAMESPACE: "http://www.w3.org/ns/ldp#",
      PREFIX_AND_NAMESPACE: { "ldp-inrupt": "http://www.w3.org/ns/ldp#" },
      NS: _NS$x,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A HTTP-addressable resource whose lifecycle is managed by a LDP server.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      Resource: _NS$x("Resource"),
      /**
       * A Linked Data Platform Resource (LDPR) whose state is represented as RDF.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      RDFSource: _NS$x("RDFSource"),
      /**
       * A Linked Data Platform Resource (LDPR) whose state is NOT represented as RDF.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      NonRDFSource: _NS$x("NonRDFSource"),
      /**
       * A Linked Data Platform RDF Source (LDP-RS) that also conforms to additional patterns and conventions for managing membership. Readers should refer to the specification defining this ontology for the list of behaviors associated with it.
       *
       * This term has [1] label and comment, in the language [fr].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      Container: _NS$x("Container"),
      /**
       * An LDPC that uses a predefined predicate to simply link to its contained resources.
       *
       * This term has [1] label and comment, in the language [fr].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      BasicContainer: _NS$x("BasicContainer"),
      /**
       * An LDPC that is similar to a LDP-DC but it allows an indirection with the ability to list as member a resource, such as a URI representing a real-world object, that is different from the resource that is created.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      DirectContainer: _NS$x("DirectContainer"),
      /**
       * An LDPC that has the flexibility of choosing what form the membership triples take.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      IndirectContainer: _NS$x("IndirectContainer"),
      /**
       * URI signifying that the resource is an in-sequence page resource, as defined by LDP Paging.  Typically used on Link rel='type' response headers.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      Page: _NS$x("Page"),
      /**
       * Element in the list of sorting criteria used by the server to assign container members to pages.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      PageSortCriterion: _NS$x("PageSortCriterion"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Indicates which predicate is used in membership triples, and that the membership triple pattern is < membership-constant-URI , object-of-hasMemberRelation, member-URI >.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      hasMemberRelation: _NS$x("hasMemberRelation"),
      /**
       * Indicates which predicate is used in membership triples, and that the membership triple pattern is < member-URI , object-of-isMemberOfRelation, membership-constant-URI >.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      isMemberOfRelation: _NS$x("isMemberOfRelation"),
      /**
       * Indicates the membership-constant-URI in a membership triple.  Depending upon the membership triple pattern a container uses, as indicated by the presence of ldp:hasMemberRelation or ldp:isMemberOfRelation, the membership-constant-URI might occupy either the subject or object position in membership triples.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      membershipResource: _NS$x("membershipResource"),
      /**
       * Indicates which triple in a creation request should be used as the member-URI value in the membership triple added when the creation request is successful.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      insertedContentRelation: _NS$x("insertedContentRelation"),
      /**
       * LDP servers should use this predicate as the membership predicate if there is no obvious predicate from an application vocabulary to use.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      member: _NS$x("member"),
      /**
       * Links a container with resources created through the container.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      contains: _NS$x("contains"),
      /**
       * Links a resource with constraints that the server requires requests like creation and update to conform to.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      constrainedBy: _NS$x("constrainedBy"),
      /**
       * Link to the list of sorting criteria used by the server in a representation.  Typically used on Link response headers as an extension link relation URI in the rel= parameter.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortCriteria: _NS$x("pageSortCriteria"),
      /**
       * Predicate used to specify the order of the members across a page sequence's in-sequence page resources; it asserts nothing about the order of members in the representation of a single page.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortPredicate: _NS$x("pageSortPredicate"),
      /**
       * The ascending/descending/etc order used to order the members across pages in a page sequence.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortOrder: _NS$x("pageSortOrder"),
      /**
       * The collation used to order the members across pages in a page sequence when comparing strings.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSortCollation: _NS$x("pageSortCollation"),
      /**
       * Link to a page sequence resource, as defined by LDP Paging.  Typically used to communicate the sorting criteria used to allocate LDPC members to pages.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ldp#
       */
      pageSequence: _NS$x("pageSequence"),
      /**
       * Links a resource to a container where notifications for the resource can be created and discovered.
       *
       * Defined by the vocabulary: https://www.w3.org/TR/ldn/
       */
      inbox: _NS$x("inbox"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$w = new rdfDataFactory.DataFactory();
  function _NS$w(localName) {
      return rdfFactory$w.namedNode("http://www.w3.org/2011/http#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * A namespace for describing HTTP messages (http://www.w3.org/Protocols/rfc2616/rfc2616.html)
   */
  var HTTP = {
      PREFIX: "http",
      NAMESPACE: "http://www.w3.org/2011/http#",
      PREFIX_AND_NAMESPACE: { "http": "http://www.w3.org/2011/http#" },
      NS: _NS$w,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A connection used for HTTP transfer.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      Connection: _NS$w("Connection"),
      /**
       * An entity header in an HTTP message.
       */
      EntityHeader: _NS$w("EntityHeader"),
      /**
       * A header in an HTTP message.
       */
      MessageHeader: _NS$w("MessageHeader"),
      /**
       * A general header in an HTTP message.
       */
      GeneralHeader: _NS$w("GeneralHeader"),
      /**
       * A part of a deconstructed header value.
       */
      HeaderElement: _NS$w("HeaderElement"),
      /**
       * A header name.
       */
      HeaderName: _NS$w("HeaderName"),
      /**
       * An HTTP message.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      Message: _NS$w("Message"),
      /**
       * The HTTP method used for the request.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      Method: _NS$w("Method"),
      /**
       * A parameter for a part of a header value.
       */
      Parameter: _NS$w("Parameter"),
      /**
       * An HTTP request.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      Request: _NS$w("Request"),
      /**
       * A header in an HTTP request message.
       */
      RequestHeader: _NS$w("RequestHeader"),
      /**
       * An HTTP response.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      Response: _NS$w("Response"),
      /**
       * A header in an HTTP response message.
       */
      ResponseHeader: _NS$w("ResponseHeader"),
      /**
       * The status code of an HTTP response.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      StatusCode: _NS$w("StatusCode"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The absolute request URI.
       */
      absoluteURI: _NS$w("absoluteURI"),
      /**
       * The request URI of an HTTP request.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      requestURI: _NS$w("requestURI"),
      /**
       * The absolute path sort of request URI.
       */
      absolutePath: _NS$w("absolutePath"),
      /**
       * The authority sort of request URI.
       */
      authority: _NS$w("authority"),
      /**
       * The entity body of an HTTP message.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      body: _NS$w("body"),
      /**
       * The authority of a connection used for the HTTP transfer.
       */
      connectionAuthority: _NS$w("connectionAuthority"),
      /**
       * The name of a header element.
       */
      elementName: _NS$w("elementName"),
      /**
       * The value of a header element.
       */
      elementValue: _NS$w("elementValue"),
      /**
       * The name of an HTTP header field.
       */
      fieldName: _NS$w("fieldName"),
      /**
       * The value of an HTTP header field.
       */
      fieldValue: _NS$w("fieldValue"),
      /**
       * The deconstructed parts of an HTTP header value.
       */
      headerElements: _NS$w("headerElements"),
      /**
       * The name of an HTTP header.
       */
      hdrName: _NS$w("hdrName"),
      /**
       * The headers in an HTTP message.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      headers: _NS$w("headers"),
      /**
       * The HTTP version of an HTTP message.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      httpVersion: _NS$w("httpVersion"),
      /**
       * The HTTP method used for the HTTP request.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      mthd: _NS$w("mthd"),
      /**
       * The HTTP method name used for the HTTP request.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      methodName: _NS$w("methodName"),
      /**
       * The name of a parameter in a part of a deconstructed HTTP header value.
       */
      paramName: _NS$w("paramName"),
      /**
       * The parameters in a part of a deconstructed HTTP header value.
       */
      params: _NS$w("params"),
      /**
       * The value of a parameter in a part of a deconstructed HTTP header value.
       */
      paramValue: _NS$w("paramValue"),
      /**
       * The reason phrase (status text) of an HTTP response.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      reasonPhrase: _NS$w("reasonPhrase"),
      /**
       * The HTTP requests made via a connection.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      requests: _NS$w("requests"),
      /**
       * The HTTP response sent in answer to an HTTP request.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      resp: _NS$w("resp"),
      /**
       * The status code of an HTTP response.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      sc: _NS$w("sc"),
      /**
       * The status code number.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      statusCodeNumber: _NS$w("statusCodeNumber"),
      /**
       * The status code value of an HTTP response.
       *
       * Defined by the vocabulary: http://www.ietf.org/rfc/rfc2616.txt
       */
      statusCodeValue: _NS$w("statusCodeValue"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$v = new rdfDataFactory.DataFactory();
  function _NS$v(localName) {
      return rdfFactory$v.namedNode("http://www.w3.org/2007/ont/httph#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * This vocabulary is a one deemed to contain all HTTP headers.
  The rdflib.js library uses it as for relationships between an HTTP response
  and the  content (value) of the HTTP header in that response.     The ontology
  is deemed to contain one property for every HTTP header, standard or not.
  The property in this ontology has a localname which is the header field converted
  to lower case.
   */
  var HTTPH_INRUPT = {
      PREFIX: "httph-inrupt",
      NAMESPACE: "http://www.w3.org/2007/ont/httph#",
      PREFIX_AND_NAMESPACE: { "httph-inrupt": "http://www.w3.org/2007/ont/httph#" },
      NS: _NS$v,
      // *******************
      // All the Properties.
      // *******************
      /**
       * See the HTTP specification
       *
       * Defined by the vocabulary: http://www.w3.org/2007/ont/httph
       */
      content_type: _NS$v("content-type"),
      /**
       * See the HTTP specification
       *
       * Defined by the vocabulary: http://www.w3.org/2007/ont/httph#
       */
      accept: _NS$v("accept"),
      /**
       * See the HTTP specification
       *
       * Defined by the vocabulary: http://www.w3.org/2007/ont/httph#
       */
      accept_language: _NS$v("accept-language"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$u = new rdfDataFactory.DataFactory();
  function _NS$u(localName) {
      return rdfFactory$u.namedNode("http://purl.org/ontology/olo/core#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - OLO (Ordered List Ontology) - for describing ordered lists
   */
  var OLO = {
      PREFIX: "olo",
      NAMESPACE: "http://purl.org/ontology/olo/core#",
      PREFIX_AND_NAMESPACE: { "olo": "http://purl.org/ontology/olo/core#" },
      NS: _NS$u,
      // *****************
      // All the Classes.
      // *****************
      /**
       * An ordered list with a given length an indexed items.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      OrderedList: _NS$u("OrderedList"),
      /**
       * A slot in an ordered list with a fixed index.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      Slot: _NS$u("Slot"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The length of an ordered list.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      length: _NS$u("length"),
      /**
       * Associates the next slot in an ordered list.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      next: _NS$u("next"),
      /**
       * An index of a slot in an ordered list.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      index: _NS$u("index"),
      /**
       * An ordered list of an slot.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      ordered_list: _NS$u("ordered_list"),
      /**
       * Associates the previous slot in an ordered list
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      previous: _NS$u("previous"),
      /**
       * An item of a slot in an ordered list.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      item: _NS$u("item"),
      /**
       * A slot in an ordered list.
       *
       * Defined by the vocabulary: http://purl.org/ontology/olo/core#
       */
      slot: _NS$u("slot"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$t = new rdfDataFactory.DataFactory();
  function _NS$t(localName) {
      return rdfFactory$t.namedNode("http://www.w3.org/2004/02/skos/core#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * An RDF vocabulary for describing the basic structure and content of concept schemes such as thesauri, classification schemes, subject heading lists, taxonomies, 'folksonomies', other types of controlled vocabulary, and also concept schemes embedded in glossaries and terminologies.
   */
  var SKOS = {
      PREFIX: "skos",
      NAMESPACE: "http://www.w3.org/2004/02/skos/core#",
      PREFIX_AND_NAMESPACE: { "skos": "http://www.w3.org/2004/02/skos/core#" },
      NS: _NS$t,
      // *****************
      // All the Classes.
      // *****************
      /**
       * An idea or notion; a unit of thought.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      Concept: _NS$t("Concept"),
      /**
       * A set of concepts, optionally including statements about semantic relationships between those concepts.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      ConceptScheme: _NS$t("ConceptScheme"),
      /**
       * A meaningful collection of concepts.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      Collection: _NS$t("Collection"),
      /**
       * An ordered collection of concepts, where both the grouping and the ordering are meaningful.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      OrderedCollection: _NS$t("OrderedCollection"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * A statement or formal explanation of the meaning of a concept.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      definition: _NS$t("definition"),
      /**
       * A note that helps to clarify the meaning and/or the use of a concept.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      scopeNote: _NS$t("scopeNote"),
      /**
       * An example of the use of a concept.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      example: _NS$t("example"),
      /**
       * Relates a resource (for example a concept) to a concept scheme in which it is included.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      inScheme: _NS$t("inScheme"),
      /**
       * Relates, by convention, a concept scheme to a concept which is topmost in the broader/narrower concept hierarchies for that scheme, providing an entry point to these hierarchies.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      hasTopConcept: _NS$t("hasTopConcept"),
      /**
       * Relates a concept to the concept scheme that it is a top level concept of.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      topConceptOf: _NS$t("topConceptOf"),
      /**
       * A resource has no more than one value of skos:prefLabel per language tag, and no more than one value of skos:prefLabel without language tag.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      prefLabel: _NS$t("prefLabel"),
      /**
       * The range of skos:altLabel is the class of RDF plain literals.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      altLabel: _NS$t("altLabel"),
      /**
       * skos:prefLabel, skos:altLabel and skos:hiddenLabel are pairwise disjoint properties.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      hiddenLabel: _NS$t("hiddenLabel"),
      /**
       * A notation, also known as classification code, is a string of characters such as "T58.5" or "303.4833" used to uniquely identify a concept within the scope of a given concept scheme.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      notation: _NS$t("notation"),
      /**
       * A general note, for any purpose.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      note: _NS$t("note"),
      /**
       * A note about a modification to a concept.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      changeNote: _NS$t("changeNote"),
      /**
       * A note for an editor, translator or maintainer of the vocabulary.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      editorialNote: _NS$t("editorialNote"),
      /**
       * A note about the past state/use/meaning of a concept.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      historyNote: _NS$t("historyNote"),
      /**
       * Links a concept to a concept related by meaning.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      semanticRelation: _NS$t("semanticRelation"),
      /**
       * Broader concepts are typically rendered as parents in a concept hierarchy (tree).
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      broader: _NS$t("broader"),
      /**
       * skos:broaderTransitive is a transitive superproperty of skos:broader.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      broaderTransitive: _NS$t("broaderTransitive"),
      /**
       * Narrower concepts are typically rendered as children in a concept hierarchy (tree).
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      narrower: _NS$t("narrower"),
      /**
       * skos:narrowerTransitive is a transitive superproperty of skos:narrower.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      narrowerTransitive: _NS$t("narrowerTransitive"),
      /**
       * skos:related is disjoint with skos:broaderTransitive
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      related: _NS$t("related"),
      /**
       * Relates a collection to one of its members.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      member: _NS$t("member"),
      /**
       * For any resource, every item in the list given as the value of the
          skos:memberList property is also a value of the skos:member property.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      memberList: _NS$t("memberList"),
      /**
       * These concept mapping relations mirror semantic relations, and the data model defined below is similar (with the exception of skos:exactMatch) to the data model defined for semantic relations. A distinct vocabulary is provided for concept mapping relations, to provide a convenient way to differentiate links within a concept scheme from links between concept schemes. However, this pattern of usage is not a formal requirement of the SKOS data model, and relies on informal definitions of best practice.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      mappingRelation: _NS$t("mappingRelation"),
      /**
       * skos:broadMatch is used to state a hierarchical mapping link between two conceptual resources in different concept schemes.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      broadMatch: _NS$t("broadMatch"),
      /**
       * skos:narrowMatch is used to state a hierarchical mapping link between two conceptual resources in different concept schemes.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      narrowMatch: _NS$t("narrowMatch"),
      /**
       * skos:relatedMatch is used to state an associative mapping link between two conceptual resources in different concept schemes.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      relatedMatch: _NS$t("relatedMatch"),
      /**
       * skos:exactMatch is disjoint with each of the properties skos:broadMatch and skos:relatedMatch.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      exactMatch: _NS$t("exactMatch"),
      /**
       * skos:closeMatch is used to link two concepts that are sufficiently similar that they can be used interchangeably in some information retrieval applications. In order to avoid the possibility of "compound errors" when combining mappings across more than two concept schemes, skos:closeMatch is not declared to be a transitive property.
       *
       * Defined by the vocabulary: http://www.w3.org/2004/02/skos/core
       */
      closeMatch: _NS$t("closeMatch"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$s = new rdfDataFactory.DataFactory();
  function _NS$s(localName) {
      return rdfFactory$s.namedNode("http://www.w3.org/2008/05/skos-xl#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * An RDF vocabulary extending SKOS and allowing the description and linking of lexical entities.
   */
  var SKOS_XL = {
      PREFIX: "skos-xl",
      NAMESPACE: "http://www.w3.org/2008/05/skos-xl#",
      PREFIX_AND_NAMESPACE: { "skos-xl": "http://www.w3.org/2008/05/skos-xl#" },
      NS: _NS$s,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A special class of lexical entities.
       *
       * Defined by the vocabulary: http://www.w3.org/2008/05/skos-xl
       */
      Label: _NS$s("Label"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * If two instances of the class skosxl:Label have the same literal form, they are not necessarily the same resource.
       *
       * Defined by the vocabulary: http://www.w3.org/2008/05/skos-xl
       */
      literalForm: _NS$s("literalForm"),
      /**
       * If C skosxl:prefLabel L and L skosxl:literalForm V, then X skos:prefLabel V.
       *
       * See also:
       *  - http://www.w3.org/2004/02/skos/core#prefLabel
       *
       * Defined by the vocabulary: http://www.w3.org/2008/05/skos-xl
       */
      prefLabel: _NS$s("prefLabel"),
      /**
       * If C skosxl:altLabel L and L skosxl:literalForm V, then X skos:altLabel V.
       *
       * See also:
       *  - http://www.w3.org/2004/02/skos/core#altLabel
       *
       * Defined by the vocabulary: http://www.w3.org/2008/05/skos-xl
       */
      altLabel: _NS$s("altLabel"),
      /**
       * If C skosxl:hiddenLabel L and L skosxl:literalForm V, then C skos:hiddenLabel V.
       *
       * See also:
       *  - http://www.w3.org/2004/02/skos/core#hiddenLabel
       *
       * Defined by the vocabulary: http://www.w3.org/2008/05/skos-xl
       */
      hiddenLabel: _NS$s("hiddenLabel"),
      /**
       * The property skosxl:labelRelation is used for representing binary ('direct') relations between instances of the class skosxl:Label.
       *
       * Defined by the vocabulary: http://www.w3.org/2008/05/skos-xl
       */
      labelRelation: _NS$s("labelRelation"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$r = new rdfDataFactory.DataFactory();
  function _NS$r(localName) {
      return rdfFactory$r.namedNode("http://www.w3.org/ns/ui#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - UI Ontology
   */
  var UI = {
      PREFIX: "ui",
      NAMESPACE: "http://www.w3.org/ns/ui#",
      PREFIX_AND_NAMESPACE: { "ui": "http://www.w3.org/ns/ui#" },
      NS: _NS$r,
      // *****************
      // All the Classes.
      // *****************
      /**
       *
       */
      BooleanField: _NS$r("BooleanField"),
      /**
       *
       */
      NumericField: _NS$r("NumericField"),
      /**
       *
       */
      Group: _NS$r("Group"),
      /**
       *
       */
      Choice: _NS$r("Choice"),
      /**
       * A form can be any type of single field, or typically a Group of several fields,
        including interspersed headings and comments.
       */
      Form: _NS$r("Form"),
      /**
       *
       */
      Single: _NS$r("Single"),
      /**
       * A classifier allows the user to select the type of an object.
        The possible types must be subclasses of some overall class, the "category".
        (Ideally, the superclass is also set up as the disjoint union of the subclasses,
        if they are disjoint.)
    
        The form normally stores the resulting classes using an r:type triple,
        but a different predicate can be used if required, so the classifier field
        needs is 'property' defined too.
    
        If the subclass selected itself is has subclasses defined, the user can
        recursively select from them in turn, as many levels as needed.
       */
      Classifier: _NS$r("Classifier"),
      /**
       *
       */
      ColorField: _NS$r("ColorField"),
      /**
       *
       */
      ValueField: _NS$r("ValueField"),
      /**
       * Comment
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      Comment: _NS$r("Comment"),
      /**
       *
       */
      DateField: _NS$r("DateField"),
      /**
       *
       */
      DateTimeField: _NS$r("DateTimeField"),
      /**
       *
       */
      DecimalField: _NS$r("DecimalField"),
      /**
       *
       */
      EmailField: _NS$r("EmailField"),
      /**
       *
       */
      Heading: _NS$r("Heading"),
      /**
       *
       */
      SingleLineTextField: _NS$r("SingleLineTextField"),
      /**
       *
       */
      Options: _NS$r("Options"),
      /**
       *
       */
      TextField: _NS$r("TextField"),
      /**
       *
       */
      IntegerField: _NS$r("IntegerField"),
      /**
       *
       */
      FloatField: _NS$r("FloatField"),
      /**
       *
       */
      PhoneField: _NS$r("PhoneField"),
      /**
       *
       */
      Multiple: _NS$r("Multiple"),
      /**
       *
       */
      MultiLineTextField: _NS$r("MultiLineTextField"),
      /**
       * A NamedNodeURIField is like a SingleLineTextField, except
            that the value it generates is not a literal string but an RDF node with the given URI.
            Normally users should not see URIs. When they do, this a way to do it.
            
       */
      NamedNodeURIField: _NS$r("NamedNodeURIField"),
      /**
       *
       */
      TriStateField: _NS$r("TriStateField"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * from
       */
      from: _NS$r("from"),
      /**
       * Label
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      label: _NS$r("label"),
      /**
       * Many fields prompt for information about a given property of the subject.
        When field is filled in, this gives which property is written into the data.
       */
      property: _NS$r("property"),
      /**
       * The value for which this case is selected.
       */
      for: _NS$r("for"),
      /**
       *
       */
      use: _NS$r("use"),
      /**
       * parts
       */
      parts: _NS$r("parts"),
      /**
       * Must be a valid CSS color string such as one could put in
                an HTML style attribute.  This must be in the #xxxxxx form,
                (with 6 digits of lowercase hex) so that it
                can work eg with Graphviz.
                As this is just an encoded array of RGB values,
                you can do math with these, such as blending, complement, etc.
       */
      Color: _NS$r("Color"),
      /**
       * Contents
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      contents: _NS$r("contents"),
      /**
       * size of field
       */
      size: _NS$r("size"),
      /**
       * Must be a valid CSS style string such as one could put in
            an HTML style attribute.  Depending on the user interface system, this can
            by given to individuals, classes or properties. It is up to a user interface
            which wants to draw on them to pick how it uses styles from which parts
            of the data it has.  For example, the style of a class may be picked
            to distinguish information about things in that class.
       */
      style: _NS$r("style"),
      /**
       * The superclass subclasses of which will be selected.
       */
      category: _NS$r("category"),
      /**
       * Max length
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      maxLength: _NS$r("maxLength"),
      /**
       * Many fields prompt for information about a given property of the subject
       */
      dependingOn: _NS$r("dependingOn"),
      /**
       * part
       */
      part: _NS$r("part"),
      /**
       * A form which may be used to collect information about a
        hitherto locally undocumented instance instance of this class.
       */
      creationForm: _NS$r("creationForm"),
      /**
       * Time field
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      TimeField: _NS$r("TimeField"),
      /**
       * A form which may be used to add more infromation to an
    instance of this class which we know something about.  Anything from
    adding just add one more fact, to adding a whole lot of information about a specific
    facet of the thing.
    
       */
      annotationForm: _NS$r("annotationForm"),
      /**
       * background color
       */
      backgroundColor: _NS$r("backgroundColor"),
      /**
       * URI or base64 representation of an image
       */
      backgroundImage: _NS$r("backgroundImage"),
      /**
       * Base
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      base: _NS$r("base"),
      /**
       * color
       */
      color: _NS$r("color"),
      /**
       * Default error
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      defaultError: _NS$r("defaultError"),
      /**
       * A string for the UI to use if the user needs a longer
            prompts than just a field name, the s:label.
       */
      prompt: _NS$r("prompt"),
      /**
       * A really simple way of enabling user interfaces to
                create new information about a class of things is to make a define of properties
                to be specified when a information about a new item
                ("New item" here means an item which the system
                does not have prvious information about yet,
                not an items which has just been created,
                like new friend as opposed to new baby)
       */
      initialProperties: _NS$r("initialProperties"),
      /**
       * Maximum date offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      maxDateOffset: _NS$r("maxDateOffset"),
      /**
       * Maximum datetime offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      maxDatetimeOffset: _NS$r("maxDatetimeOffset"),
      /**
       * max
       */
      maxValue: _NS$r("maxValue"),
      /**
       * Minimum date offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      minDateOffset: _NS$r("minDateOffset"),
      /**
       * Minimum datetime offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      minDatetimeOffset: _NS$r("minDatetimeOffset"),
      /**
       * Min length
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      minLength: _NS$r("minLength"),
      /**
       * min
       */
      minValue: _NS$r("minValue"),
      /**
       * Name
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      name: _NS$r("name"),
      /**
       * Old value
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      oldValue: _NS$r("oldValue"),
      /**
       * Parent property
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      parentProperty: _NS$r("parentProperty"),
      /**
       * Parts clone
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      partsClone: _NS$r("partsClone"),
      /**
       * Pattern
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      pattern: _NS$r("pattern"),
      /**
       * Reference
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      reference: _NS$r("reference"),
      /**
       * Required
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      required: _NS$r("required"),
      /**
       * Required error
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      requiredError: _NS$r("requiredError"),
      /**
       * The sequence in which this item is arranged with repect to other parts.
       */
      seqeunce: _NS$r("seqeunce"),
      /**
       * A property which typically is used to sort
            members of a given class.
       */
      sortBy: _NS$r("sortBy"),
      /**
       * When individuals or classes must be sorted, then
            if they are given different values of sortPriority a user agent can
            use this as a hint to how to present information.
       */
      sortPriority: _NS$r("sortPriority"),
      /**
       * This  is a crude way of specifying a table-based
                view for objects of this class.
       */
      tableProperties: _NS$r("tableProperties"),
      /**
       * Valid
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      valid: _NS$r("valid"),
      /**
       * Validation error
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      validationError: _NS$r("validationError"),
      /**
       * Value
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      value: _NS$r("value"),
      /**
       * Values
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/ui
       */
      values: _NS$r("values"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$q = new rdfDataFactory.DataFactory();
  function _NS$q(localName) {
      return rdfFactory$q.namedNode("http://www.w3.org/ns/ui#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Extension to UI terms providing multilingual alternative names and translations for comments (e.g. for use directly as labels or tool-tips in user interfaces or error messages)
   */
  var UI_INRUPT = {
      PREFIX: "ui-inrupt",
      NAMESPACE: "http://www.w3.org/ns/ui#",
      PREFIX_AND_NAMESPACE: { "ui-inrupt": "http://www.w3.org/ns/ui#" },
      NS: _NS$q,
      // *****************
      // All the Classes.
      // *****************
      /**
       *
       */
      BooleanField: _NS$q("BooleanField"),
      /**
       *
       */
      NumericField: _NS$q("NumericField"),
      /**
       *
       */
      ValueField: _NS$q("ValueField"),
      /**
       *
       */
      Group: _NS$q("Group"),
      /**
       * A form can be any type of single field, or typically a Group of several fields,
        including interspersed headings and comments.
       */
      Form: _NS$q("Form"),
      /**
       *
       */
      Single: _NS$q("Single"),
      /**
       *
       */
      Choice: _NS$q("Choice"),
      /**
       * A classifier allows the user to select the type of an object.
        The possible types must be subclasses of some overall class, the "category".
        (Ideally, the superclass is also set up as the disjoint union of the subclasses,
        if they are disjoint.)
    
        The form normally stores the resulting classes using an r:type triple,
        but a different predicate can be used if required, so the classifier field
        needs is 'property' defined too.
    
        If the subclass selected itself is has subclasses defined, the user can
        recursively select from them in turn, as many levels as needed.
       */
      Classifier: _NS$q("Classifier"),
      /**
       *
       */
      ColorField: _NS$q("ColorField"),
      /**
       * Comment
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      Comment: _NS$q("Comment"),
      /**
       *
       */
      DateField: _NS$q("DateField"),
      /**
       *
       */
      DateTimeField: _NS$q("DateTimeField"),
      /**
       *
       */
      DecimalField: _NS$q("DecimalField"),
      /**
       *
       */
      EmailField: _NS$q("EmailField"),
      /**
       *
       */
      Heading: _NS$q("Heading"),
      /**
       *
       */
      SingleLineTextField: _NS$q("SingleLineTextField"),
      /**
       *
       */
      TextField: _NS$q("TextField"),
      /**
       *
       */
      Options: _NS$q("Options"),
      /**
       *
       */
      IntegerField: _NS$q("IntegerField"),
      /**
       *
       */
      FloatField: _NS$q("FloatField"),
      /**
       *
       */
      PhoneField: _NS$q("PhoneField"),
      /**
       *
       */
      Multiple: _NS$q("Multiple"),
      /**
       *
       */
      MultiLineTextField: _NS$q("MultiLineTextField"),
      /**
       * A NamedNodeURIField is like a SingleLineTextField, except
            that the value it generates is not a literal string but an RDF node with the given URI.
            Normally users should not see URIs. When they do, this a way to do it.
            
       */
      NamedNodeURIField: _NS$q("NamedNodeURIField"),
      /**
       *
       */
      TriStateField: _NS$q("TriStateField"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * parts
       */
      parts: _NS$q("parts"),
      /**
       * from
       */
      from: _NS$q("from"),
      /**
       * Label
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      label: _NS$q("label"),
      /**
       * Many fields prompt for information about a given property of the subject.
        When field is filled in, this gives which property is written into the data.
       */
      property: _NS$q("property"),
      /**
       * The value for which this case is selected.
       */
      for: _NS$q("for"),
      /**
       * A string for the UI to use if the user needs a longer
            prompts than just a field name, the s:label.
       */
      prompt: _NS$q("prompt"),
      /**
       *
       */
      use: _NS$q("use"),
      /**
       * A form which may be used to collect information about a
        hitherto locally undocumented instance instance of this class.
       */
      creationForm: _NS$q("creationForm"),
      /**
       * Must be a valid CSS color string such as one could put in
                an HTML style attribute.  This must be in the #xxxxxx form,
                (with 6 digits of lowercase hex) so that it
                can work eg with Graphviz.
                As this is just an encoded array of RGB values,
                you can do math with these, such as blending, complement, etc.
       */
      Color: _NS$q("Color"),
      /**
       * Contents
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      contents: _NS$q("contents"),
      /**
       * size of field
       */
      size: _NS$q("size"),
      /**
       * Must be a valid CSS style string such as one could put in
            an HTML style attribute.  Depending on the user interface system, this can
            by given to individuals, classes or properties. It is up to a user interface
            which wants to draw on them to pick how it uses styles from which parts
            of the data it has.  For example, the style of a class may be picked
            to distinguish information about things in that class.
       */
      style: _NS$q("style"),
      /**
       * The superclass subclasses of which will be selected.
       */
      category: _NS$q("category"),
      /**
       * Many fields prompt for information about a given property of the subject
       */
      dependingOn: _NS$q("dependingOn"),
      /**
       * Max length
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      maxLength: _NS$q("maxLength"),
      /**
       * part
       */
      part: _NS$q("part"),
      /**
       * Time field
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      TimeField: _NS$q("TimeField"),
      /**
       * A form which may be used to add more infromation to an
    instance of this class which we know something about.  Anything from
    adding just add one more fact, to adding a whole lot of information about a specific
    facet of the thing.
    
       */
      annotationForm: _NS$q("annotationForm"),
      /**
       * background color
       */
      backgroundColor: _NS$q("backgroundColor"),
      /**
       * URI or base64 representation of an image
       */
      backgroundImage: _NS$q("backgroundImage"),
      /**
       * Base
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      base: _NS$q("base"),
      /**
       * color
       */
      color: _NS$q("color"),
      /**
       * Default error
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      defaultError: _NS$q("defaultError"),
      /**
       * A really simple way of enabling user interfaces to
                create new information about a class of things is to make a define of properties
                to be specified when a information about a new item
                ("New item" here means an item which the system
                does not have prvious information about yet,
                not an items which has just been created,
                like new friend as opposed to new baby)
       */
      initialProperties: _NS$q("initialProperties"),
      /**
       * Maximum date offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      maxDateOffset: _NS$q("maxDateOffset"),
      /**
       * Maximum datetime offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      maxDatetimeOffset: _NS$q("maxDatetimeOffset"),
      /**
       * max
       */
      maxValue: _NS$q("maxValue"),
      /**
       * Minimum date offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      minDateOffset: _NS$q("minDateOffset"),
      /**
       * Minimum datetime offset
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      minDatetimeOffset: _NS$q("minDatetimeOffset"),
      /**
       * Min length
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      minLength: _NS$q("minLength"),
      /**
       * min
       */
      minValue: _NS$q("minValue"),
      /**
       * Name
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      name: _NS$q("name"),
      /**
       * Old value
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      oldValue: _NS$q("oldValue"),
      /**
       * Parent property
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      parentProperty: _NS$q("parentProperty"),
      /**
       * Parts clone
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      partsClone: _NS$q("partsClone"),
      /**
       * Pattern
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      pattern: _NS$q("pattern"),
      /**
       * Reference
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      reference: _NS$q("reference"),
      /**
       * Required
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      required: _NS$q("required"),
      /**
       * Required error
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      requiredError: _NS$q("requiredError"),
      /**
       * The sequence in which this item is arranged with repect to other parts.
       */
      seqeunce: _NS$q("seqeunce"),
      /**
       * A property which typically is used to sort
            members of a given class.
       */
      sortBy: _NS$q("sortBy"),
      /**
       * When individuals or classes must be sorted, then
            if they are given different values of sortPriority a user agent can
            use this as a hint to how to present information.
       */
      sortPriority: _NS$q("sortPriority"),
      /**
       * This  is a crude way of specifying a table-based
                view for objects of this class.
       */
      tableProperties: _NS$q("tableProperties"),
      /**
       * Valid
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      valid: _NS$q("valid"),
      /**
       * Validation error
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      validationError: _NS$q("validationError"),
      /**
       * Value
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      value: _NS$q("value"),
      /**
       * Values
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       *
       * Defined by the vocabulary: https://w3id.org/inrupt/vocab/extension/ui#
       */
      values: _NS$q("values"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$p = new rdfDataFactory.DataFactory();
  function _NS$p(localName) {
      return rdfFactory$p.namedNode("http://purl.org/vocab/vann/" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * A vocabulary for annotating vocabulary descriptions (VANN).
   */
  var VANN = {
      PREFIX: "vann",
      NAMESPACE: "http://purl.org/vocab/vann/",
      PREFIX_AND_NAMESPACE: { "vann": "http://purl.org/vocab/vann/" },
      NS: _NS$p,
      // *******************
      // All the Properties.
      // *******************
      /**
       * The preferred namespace prefix to ue when using terms from this vocabulary in an XML document.
       */
      preferredNamespacePrefix: _NS$p("preferredNamespacePrefix"),
      /**
       * The preferred namespace URI to use when using terms from this vocabulary in an XML document.
       */
      preferredNamespaceUri: _NS$p("preferredNamespaceUri"),
      /**
       * A reference to a resource that describes changes between this version of a vocabulary and the previous.
       */
      changes: _NS$p("changes"),
      /**
       * A reference to a resource that provides an example of how this resource can be used.
       */
      example: _NS$p("example"),
      /**
       * A group of related terms in a vocabulary.
       */
      termGroup: _NS$p("termGroup"),
      /**
       * A reference to a resource that provides information on how this resource is to be used.
       */
      usageNote: _NS$p("usageNote"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$o = new rdfDataFactory.DataFactory();
  function _NS$o(localName) {
      return rdfFactory$o.namedNode("http://purl.org/dc/terms/" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Dublin Core Terms - for describing resources
   */
  var DCTERMS = {
      PREFIX: "dcterms",
      NAMESPACE: "http://purl.org/dc/terms/",
      PREFIX_AND_NAMESPACE: { "dcterms": "http://purl.org/dc/terms/" },
      NS: _NS$o,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A resource that acts or has the power to act.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Agent: _NS$o("Agent"),
      /**
       * A group of agents.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      AgentClass: _NS$o("AgentClass"),
      /**
       * A book, article, or other documentary resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      BibliographicResource: _NS$o("BibliographicResource"),
      /**
       * A digital resource format.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      FileFormat: _NS$o("FileFormat"),
      /**
       * A file format or physical medium.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      MediaType: _NS$o("MediaType"),
      /**
       * A rate at which something recurs.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Frequency: _NS$o("Frequency"),
      /**
       * The extent or range of judicial, law enforcement, or other authority.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Jurisdiction: _NS$o("Jurisdiction"),
      /**
       * A location, period of time, or jurisdiction.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      LocationPeriodOrJurisdiction: _NS$o("LocationPeriodOrJurisdiction"),
      /**
       * A legal document giving official permission to do something with a Resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      LicenseDocument: _NS$o("LicenseDocument"),
      /**
       * A statement about the intellectual property rights (IPR) held in or over a Resource, a legal document giving official permission to do something with a resource, or a statement about access rights.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      RightsStatement: _NS$o("RightsStatement"),
      /**
       * A system of signs, symbols, sounds, gestures, or rules used in communication.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      LinguisticSystem: _NS$o("LinguisticSystem"),
      /**
       * A spatial region or named place.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Location: _NS$o("Location"),
      /**
       * A media type or extent.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      MediaTypeOrExtent: _NS$o("MediaTypeOrExtent"),
      /**
       * A method by which resources are added to a collection.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      MethodOfAccrual: _NS$o("MethodOfAccrual"),
      /**
       * A process that is used to engender knowledge, attitudes, and skills.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      MethodOfInstruction: _NS$o("MethodOfInstruction"),
      /**
       * An interval of time that is named or defined by its start and end dates.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      PeriodOfTime: _NS$o("PeriodOfTime"),
      /**
       * A physical material or carrier.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      PhysicalMedium: _NS$o("PhysicalMedium"),
      /**
       * A material thing.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      PhysicalResource: _NS$o("PhysicalResource"),
      /**
       * A plan or course of action by an authority, intended to influence and determine decisions, actions, and other matters.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Policy: _NS$o("Policy"),
      /**
       * A statement of any changes in ownership and custody of a resource since its creation that are significant for its authenticity, integrity, and interpretation.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      ProvenanceStatement: _NS$o("ProvenanceStatement"),
      /**
       * A dimension or extent, or a time taken to play or execute.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      SizeOrDuration: _NS$o("SizeOrDuration"),
      /**
       * A basis for comparison; a reference point against which other things can be evaluated.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Standard: _NS$o("Standard"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Date on which the resource was changed.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      modified: _NS$o("modified"),
      /**
       * An entity responsible for making the resource available.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      publisher: _NS$o("publisher"),
      /**
       * A name given to the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      title: _NS$o("title"),
      /**
       * An account of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      description: _NS$o("description"),
      /**
       * A related resource that is a version, edition, or adaptation of the described resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      hasVersion: _NS$o("hasVersion"),
      /**
       * Date of formal issuance (e.g., publication) of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      issued: _NS$o("issued"),
      /**
       * The set of regions in space defined by their geographic coordinates according to the DCMI Box Encoding Scheme.
       *
       * See also:
       *  - http://dublincore.org/documents/dcmi-box/
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Box: _NS$o("Box"),
      /**
       * The set of codes listed in ISO 3166-1 for the representation of names of countries.
       *
       * See also:
       *  - http://www.iso.org/iso/en/prods-services/iso3166ma/02iso-3166-code-lists/list-en1.html
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      ISO3166: _NS$o("ISO3166"),
      /**
       * The three-letter alphabetic codes listed in ISO639-2 for the representation of names of languages.
       *
       * See also:
       *  - http://lcweb.loc.gov/standards/iso639-2/langhome.html
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      ISO639_2: _NS$o("ISO639-2"),
      /**
       * The set of three-letter codes listed in ISO 639-3 for the representation of names of languages.
       *
       * See also:
       *  - http://www.sil.org/iso639-3/
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      ISO639_3: _NS$o("ISO639-3"),
      /**
       * The set of time intervals defined by their limits according to the DCMI Period Encoding Scheme.
       *
       * See also:
       *  - http://dublincore.org/documents/dcmi-period/
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Period: _NS$o("Period"),
      /**
       * The set of points in space defined by their geographic coordinates according to the DCMI Point Encoding Scheme.
       *
       * See also:
       *  - http://dublincore.org/documents/dcmi-point/
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      Point: _NS$o("Point"),
      /**
       * The set of tags, constructed according to RFC 1766, for the identification of languages.
       *
       * See also:
       *  - http://www.ietf.org/rfc/rfc1766.txt
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      RFC1766: _NS$o("RFC1766"),
      /**
       * The set of tags constructed according to RFC 3066 for the identification of languages.
       *
       * See also:
       *  - http://www.ietf.org/rfc/rfc3066.txt
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      RFC3066: _NS$o("RFC3066"),
      /**
       * The set of tags constructed according to RFC 4646 for the identification of languages.
       *
       * See also:
       *  - http://www.ietf.org/rfc/rfc4646.txt
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      RFC4646: _NS$o("RFC4646"),
      /**
       * The set of tags constructed according to RFC 5646 for the identification of languages.
       *
       * See also:
       *  - http://www.ietf.org/rfc/rfc5646.txt
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      RFC5646: _NS$o("RFC5646"),
      /**
       * The set of identifiers constructed according to the generic syntax for Uniform Resource Identifiers as specified by the Internet Engineering Task Force.
       *
       * See also:
       *  - http://www.ietf.org/rfc/rfc3986.txt
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      URI: _NS$o("URI"),
      /**
       * The set of dates and times constructed according to the W3C Date and Time Formats Specification.
       *
       * See also:
       *  - http://www.w3.org/TR/NOTE-datetime
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      W3CDTF: _NS$o("W3CDTF"),
      /**
       * A summary of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      abstract: _NS$o("abstract"),
      /**
       * Information about who can access the resource or an indication of its security status.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      accessRights: _NS$o("accessRights"),
      /**
       * Information about rights held in and over the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      rights: _NS$o("rights"),
      /**
       * The method by which items are added to a collection.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      accrualMethod: _NS$o("accrualMethod"),
      /**
       * The frequency with which items are added to a collection.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      accrualPeriodicity: _NS$o("accrualPeriodicity"),
      /**
       * The policy governing the addition of items to a collection.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      accrualPolicy: _NS$o("accrualPolicy"),
      /**
       * An alternative name for the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      alternative: _NS$o("alternative"),
      /**
       * A class of entity for whom the resource is intended or useful.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      audience: _NS$o("audience"),
      /**
       * Date (often a range) that the resource became or will become available.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      available: _NS$o("available"),
      /**
       * A point or period of time associated with an event in the lifecycle of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      date: _NS$o("date"),
      /**
       * A bibliographic reference for the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      bibliographicCitation: _NS$o("bibliographicCitation"),
      /**
       * An unambiguous reference to the resource within a given context.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      identifier: _NS$o("identifier"),
      /**
       * An established standard to which the described resource conforms.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      conformsTo: _NS$o("conformsTo"),
      /**
       * A related resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      relation: _NS$o("relation"),
      /**
       * An entity responsible for making contributions to the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      contributor: _NS$o("contributor"),
      /**
       * The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      coverage: _NS$o("coverage"),
      /**
       * Date of creation of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      created: _NS$o("created"),
      /**
       * An entity primarily responsible for making the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      creator: _NS$o("creator"),
      /**
       * Date of acceptance of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      dateAccepted: _NS$o("dateAccepted"),
      /**
       * Date of copyright.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      dateCopyrighted: _NS$o("dateCopyrighted"),
      /**
       * Date of submission of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      dateSubmitted: _NS$o("dateSubmitted"),
      /**
       * A class of entity, defined in terms of progression through an educational or training context, for which the described resource is intended.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      educationLevel: _NS$o("educationLevel"),
      /**
       * The size or duration of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      extent: _NS$o("extent"),
      /**
       * The file format, physical medium, or dimensions of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      format: _NS$o("format"),
      /**
       * A related resource that is substantially the same as the pre-existing described resource, but in another format.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      hasFormat: _NS$o("hasFormat"),
      /**
       * A related resource that is included either physically or logically in the described resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      hasPart: _NS$o("hasPart"),
      /**
       * A process, used to engender knowledge, attitudes and skills, that the described resource is designed to support.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      instructionalMethod: _NS$o("instructionalMethod"),
      /**
       * A related resource that is substantially the same as the described resource, but in another format.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      isFormatOf: _NS$o("isFormatOf"),
      /**
       * A related resource in which the described resource is physically or logically included.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      isPartOf: _NS$o("isPartOf"),
      /**
       * A related resource that references, cites, or otherwise points to the described resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      isReferencedBy: _NS$o("isReferencedBy"),
      /**
       * A related resource that supplants, displaces, or supersedes the described resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      isReplacedBy: _NS$o("isReplacedBy"),
      /**
       * A related resource that requires the described resource to support its function, delivery, or coherence.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      isRequiredBy: _NS$o("isRequiredBy"),
      /**
       * A related resource of which the described resource is a version, edition, or adaptation.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      isVersionOf: _NS$o("isVersionOf"),
      /**
       * A language of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      language: _NS$o("language"),
      /**
       * A legal document giving official permission to do something with the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      license: _NS$o("license"),
      /**
       * An entity that mediates access to the resource and for whom the resource is intended or useful.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      mediator: _NS$o("mediator"),
      /**
       * The material or physical carrier of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      medium: _NS$o("medium"),
      /**
       * A statement of any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      provenance: _NS$o("provenance"),
      /**
       * A related resource that is referenced, cited, or otherwise pointed to by the described resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      references: _NS$o("references"),
      /**
       * A related resource that is supplanted, displaced, or superseded by the described resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      replaces: _NS$o("replaces"),
      /**
       * A related resource that is required by the described resource to support its function, delivery, or coherence.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      requires: _NS$o("requires"),
      /**
       * A person or organization owning or managing rights over the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      rightsHolder: _NS$o("rightsHolder"),
      /**
       * A related resource from which the described resource is derived.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      source: _NS$o("source"),
      /**
       * Spatial characteristics of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      spatial: _NS$o("spatial"),
      /**
       * The topic of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      subject: _NS$o("subject"),
      /**
       * A list of subunits of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      tableOfContents: _NS$o("tableOfContents"),
      /**
       * Temporal characteristics of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      temporal: _NS$o("temporal"),
      /**
       * The nature or genre of the resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      type: _NS$o("type"),
      /**
       * Date (often a range) of validity of a resource.
       *
       * Defined by the vocabulary: http://purl.org/dc/terms/
       */
      valid: _NS$o("valid"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$n = new rdfDataFactory.DataFactory();
  function _NS$n(localName) {
      return rdfFactory$n.namedNode("https://www.w3.org/ns/activitystreams#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Extended Activity Streams 2.0 Vocabulary
   */
  var AS = {
      PREFIX: "as",
      NAMESPACE: "https://www.w3.org/ns/activitystreams#",
      PREFIX_AND_NAMESPACE: { "as": "https://www.w3.org/ns/activitystreams#" },
      NS: _NS$n,
      // *****************
      // All the Classes.
      // *****************
      /**
       * An Object representing some form of Action that has been taken
       */
      Activity: _NS$n("Activity"),
      /**
       * Object
       */
      Object: _NS$n("Object"),
      /**
       * Represents a qualified reference to another resource. Patterned after the RFC5988 Web Linking Model
       */
      Link: _NS$n("Link"),
      /**
       * An ordered or unordered collection of Objects or Links
       */
      Collection: _NS$n("Collection"),
      /**
       * A subset of items from a Collection
       */
      CollectionPage: _NS$n("CollectionPage"),
      /**
       * An Image file
       */
      Image: _NS$n("Image"),
      /**
       * A rdf:List variant for Objects and Links
       */
      OrderedItems: _NS$n("OrderedItems"),
      /**
       * Represents a Social Graph relationship between two Individuals (indicated by the 'a' and 'b' properties)
       */
      Relationship: _NS$n("Relationship"),
      /**
       * A question of any sort.
       */
      Question: _NS$n("Question"),
      /**
       * A Profile Document
       */
      Profile: _NS$n("Profile"),
      /**
       * A placeholder for a deleted object
       */
      Tombstone: _NS$n("Tombstone"),
      /**
       * A physical or logical location
       */
      Place: _NS$n("Place"),
      /**
       * An ordered subset of items from an OrderedCollection
       */
      OrderedCollectionPage: _NS$n("OrderedCollectionPage"),
      /**
       * Actor accepts the Object
       */
      Accept: _NS$n("Accept"),
      /**
       * Block
       */
      Block: _NS$n("Block"),
      /**
       * Actor is ignoring the Object
       */
      Ignore: _NS$n("Ignore"),
      /**
       * An Activity that has no direct object
       */
      IntransitiveActivity: _NS$n("IntransitiveActivity"),
      /**
       * To Add an Object or Link to Something
       */
      Add: _NS$n("Add"),
      /**
       * Actor announces the object to the target
       */
      Announce: _NS$n("Announce"),
      /**
       * Represents a software application of any sort
       */
      Application: _NS$n("Application"),
      /**
       * To Arrive Somewhere (can be used, for instance, to indicate that a particular entity is currently located somewhere, e.g. a "check-in")
       */
      Arrive: _NS$n("Arrive"),
      /**
       * A written work. Typically several paragraphs long. For example, a blog post or a news article.
       */
      Article: _NS$n("Article"),
      /**
       * An audio file
       */
      Audio: _NS$n("Audio"),
      /**
       * Represents a digital document/file of any sort
       */
      Document: _NS$n("Document"),
      /**
       * A variation of Collection in which items are strictly ordered
       */
      OrderedCollection: _NS$n("OrderedCollection"),
      /**
       * To Create Something
       */
      Create: _NS$n("Create"),
      /**
       * To Delete Something
       */
      Delete: _NS$n("Delete"),
      /**
       * The actor dislikes the object
       */
      Dislike: _NS$n("Dislike"),
      /**
       * An Event of any kind
       */
      Event: _NS$n("Event"),
      /**
       * To flag something (e.g. flag as inappropriate, flag as spam, etc)
       */
      Flag: _NS$n("Flag"),
      /**
       * To Express Interest in Something
       */
      Follow: _NS$n("Follow"),
      /**
       * A Group of any kind.
       */
      Group: _NS$n("Group"),
      /**
       * To invite someone or something to something
       */
      Invite: _NS$n("Invite"),
      /**
       * To Offer something to someone or something
       */
      Offer: _NS$n("Offer"),
      /**
       * To Join Something
       */
      Join: _NS$n("Join"),
      /**
       * To Leave Something
       */
      Leave: _NS$n("Leave"),
      /**
       * To Like Something
       */
      Like: _NS$n("Like"),
      /**
       * The actor viewed the object
       */
      View: _NS$n("View"),
      /**
       * The actor listened to the object
       */
      Listen: _NS$n("Listen"),
      /**
       * The actor read the object
       */
      Read: _NS$n("Read"),
      /**
       * The actor is moving the object. The target specifies where the object is moving to. The origin specifies where the object is moving from.
       */
      Move: _NS$n("Move"),
      /**
       * The actor is traveling to the target. The origin specifies where the actor is traveling from.
       */
      Travel: _NS$n("Travel"),
      /**
       * A specialized Link that represents an @mention
       */
      Mention: _NS$n("Mention"),
      /**
       * A Short note, typically less than a single paragraph. A "tweet" is an example, or a "status update"
       */
      Note: _NS$n("Note"),
      /**
       * A Web Page
       */
      Page: _NS$n("Page"),
      /**
       * A Person
       */
      Person: _NS$n("Person"),
      /**
       * An Organization
       */
      Organization: _NS$n("Organization"),
      /**
       * Actor rejects the Object
       */
      Reject: _NS$n("Reject"),
      /**
       * To Remove Something
       */
      Remove: _NS$n("Remove"),
      /**
       * A service provided by some entity
       */
      Service: _NS$n("Service"),
      /**
       * Actor tentatively accepts the Object
       */
      TentativeAccept: _NS$n("TentativeAccept"),
      /**
       * Actor tentatively rejects the object
       */
      TentativeReject: _NS$n("TentativeReject"),
      /**
       * To Undo Something. This would typically be used to indicate that a previous Activity has been undone.
       */
      Undo: _NS$n("Undo"),
      /**
       * To Update/Modify Something
       */
      Update: _NS$n("Update"),
      /**
       * A Video document of any kind.
       */
      Video: _NS$n("Video"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Subproperty of as:attributedTo that identifies the primary actor
       */
      actor: _NS$n("actor"),
      /**
       * Identifies an entity to which an object is attributed
       */
      attributedTo: _NS$n("attributedTo"),
      /**
       * attachment
       */
      attachment: _NS$n("attachment"),
      /**
       * attachments
       */
      attachments: _NS$n("attachments"),
      /**
       * Identifies the author of an object. Deprecated. Use as:attributedTo instead
       */
      author: _NS$n("author"),
      /**
       * bcc
       */
      bcc: _NS$n("bcc"),
      /**
       * bto
       */
      bto: _NS$n("bto"),
      /**
       * cc
       */
      cc: _NS$n("cc"),
      /**
       * Specifies the context within which an object exists or an activity was performed
       */
      context: _NS$n("context"),
      /**
       * current
       */
      current: _NS$n("current"),
      /**
       * first
       */
      first: _NS$n("first"),
      /**
       * generator
       */
      generator: _NS$n("generator"),
      /**
       * icon
       */
      icon: _NS$n("icon"),
      /**
       * image
       */
      image: _NS$n("image"),
      /**
       * inReplyTo
       */
      inReplyTo: _NS$n("inReplyTo"),
      /**
       * items
       */
      items: _NS$n("items"),
      /**
       * last
       */
      last: _NS$n("last"),
      /**
       * location
       */
      location: _NS$n("location"),
      /**
       * next
       */
      next: _NS$n("next"),
      /**
       * object
       */
      object: _NS$n("object"),
      /**
       * Describes a possible exclusive answer or option for a question.
       */
      oneOf: _NS$n("oneOf"),
      /**
       * Describes a possible inclusive answer or option for a question.
       */
      anyOf: _NS$n("anyOf"),
      /**
       * prev
       */
      prev: _NS$n("prev"),
      /**
       * preview
       */
      preview: _NS$n("preview"),
      /**
       * provider
       */
      provider: _NS$n("provider"),
      /**
       * replies
       */
      replies: _NS$n("replies"),
      /**
       * result
       */
      result: _NS$n("result"),
      /**
       * audience
       */
      audience: _NS$n("audience"),
      /**
       * partOf
       */
      partOf: _NS$n("partOf"),
      /**
       * tag
       */
      tag: _NS$n("tag"),
      /**
       * tags
       */
      tags: _NS$n("tags"),
      /**
       * target
       */
      target: _NS$n("target"),
      /**
       * For certain activities, specifies the entity from which the action is directed.
       */
      origin: _NS$n("origin"),
      /**
       * Indentifies an object used (or to be used) to complete an activity
       */
      instrument: _NS$n("instrument"),
      /**
       * to
       */
      to: _NS$n("to"),
      /**
       * Specifies a link to a specific representation of the Object
       */
      url: _NS$n("url"),
      /**
       * On a Relationship object, identifies the subject. e.g. when saying "John is connected to Sally", 'subject' refers to 'John'
       */
      subject: _NS$n("subject"),
      /**
       * On a Relationship object, describes the type of relationship
       */
      relationship: _NS$n("relationship"),
      /**
       * On a Profile object, describes the object described by the profile
       */
      describes: _NS$n("describes"),
      /**
       * On a Tombstone object, describes the former type of the deleted object
       */
      formerType: _NS$n("formerType"),
      /**
       * Specifies the accuracy around the point established by the longitude and latitude
       */
      accuracy: _NS$n("accuracy"),
      /**
       * The altitude of a place
       */
      altitude: _NS$n("altitude"),
      /**
       * The content of the object.
       */
      content: _NS$n("content"),
      /**
       * name
       */
      name: _NS$n("name"),
      /**
       * downstreamDuplicates
       */
      downstreamDuplicates: _NS$n("downstreamDuplicates"),
      /**
       * The duration of the object
       */
      duration: _NS$n("duration"),
      /**
       * The ending time of the object
       */
      endTime: _NS$n("endTime"),
      /**
       * The display height expressed as device independent pixels
       */
      height: _NS$n("height"),
      /**
       * The target URI of the Link
       */
      href: _NS$n("href"),
      /**
       * A hint about the language of the referenced resource
       */
      hreflang: _NS$n("hreflang"),
      /**
       * id
       */
      id: _NS$n("id"),
      /**
       * The latitude
       */
      latitude: _NS$n("latitude"),
      /**
       * The longitude
       */
      longitude: _NS$n("longitude"),
      /**
       * The MIME Media Type
       */
      mediaType: _NS$n("mediaType"),
      /**
       * objectType
       */
      objectType: _NS$n("objectType"),
      /**
       * Specifies the date and time the object was published
       */
      published: _NS$n("published"),
      /**
       * Specifies a radius around the point established by the longitude and latitude
       */
      radius: _NS$n("radius"),
      /**
       * A numeric rating (>= 0.0, <= 5.0) for the object
       */
      rating: _NS$n("rating"),
      /**
       * The RFC 5988 or HTML5 Link Relation associated with the Link
       */
      rel: _NS$n("rel"),
      /**
       * In a strictly ordered logical collection, specifies the index position of the first item in the items list
       */
      startIndex: _NS$n("startIndex"),
      /**
       * The starting time of the object
       */
      startTime: _NS$n("startTime"),
      /**
       * A short summary of the object
       */
      summary: _NS$n("summary"),
      /**
       * The total number of items in a logical collection
       */
      totalItems: _NS$n("totalItems"),
      /**
       * Identifies the unit of measurement used by the radius, altitude and accuracy properties. The value can be expressed either as one of a set of predefined units or as a well-known common URI that identifies units.
       */
      units: _NS$n("units"),
      /**
       * Specifies when the object was last updated
       */
      updated: _NS$n("updated"),
      /**
       * upstreamDuplicates
       */
      upstreamDuplicates: _NS$n("upstreamDuplicates"),
      /**
       * verb
       */
      verb: _NS$n("verb"),
      /**
       * Specifies the preferred display width of the content, expressed in terms of device independent pixels.
       */
      width: _NS$n("width"),
      /**
       * Specifies the date and time the object was deleted
       */
      deleted: _NS$n("deleted"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$m = new rdfDataFactory.DataFactory();
  function _NS$m(localName) {
      return rdfFactory$m.namedNode("http://persistence.uni-leipzig.org/nlp2rdf/ontologies/rlog#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * Inrupt-created copy of RLOG, needed due to Server 500 errors resolving original uni-leipzig.org!
   */
  var RLOG = {
      PREFIX: "rlog",
      NAMESPACE: "http://persistence.uni-leipzig.org/nlp2rdf/ontologies/rlog#",
      PREFIX_AND_NAMESPACE: { "rlog": "http://persistence.uni-leipzig.org/nlp2rdf/ontologies/rlog#" },
      NS: _NS$m,
      // *****************
      // All the Classes.
      // *****************
      /**
       * look here: http://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/Level.html
       */
      Level: _NS$m("Level"),
      /**
       * An entry in a log.
       */
      Entry: _NS$m("Entry"),
      /**
       * A status code which can occur in an application. Instances of this class must put the name of the status as rdfs:label and describe it with rdfs:comment.
       */
      StatusCode: _NS$m("StatusCode"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The ALL has the lowest possible rank and is intended to turn on all logging.
       */
      ALL: _NS$m("ALL"),
      /**
       * Attention: the ids here can change, they are just used to define an order over the levels!
       */
      priority: _NS$m("priority"),
      /**
       * The DEBUG Level designates fine-grained informational events that are most useful to debug an application.
       */
      DEBUG: _NS$m("DEBUG"),
      /**
       * The ERROR level designates error events that might still allow the application to continue running.
       */
      ERROR: _NS$m("ERROR"),
      /**
       * The FATAL level designates very severe error events that will presumably lead the application to abort.
       */
      FATAL: _NS$m("FATAL"),
      /**
       * The INFO level designates informational messages that highlight the progress of the application at coarse-grained level.
       */
      INFO: _NS$m("INFO"),
      /**
       * The OFF has the highest possible rank and is intended to turn off logging.
       */
      OFF: _NS$m("OFF"),
      /**
       * The TRACE Level designates finer-grained informational events than the DEBUG.
       */
      TRACE: _NS$m("TRACE"),
      /**
       * The WARN level designates potentially harmful situations.
       */
      WARN: _NS$m("WARN"),
      /**
       * Outputs the fully qualified class name of the caller issuing the logging request.
       */
      className: _NS$m("className"),
      /**
       * The numerical value of the code, e.g. 200, 404 or 42.
       */
      codeId: _NS$m("codeId"),
      /**
       * Logging datetime (or just date)
       */
      date: _NS$m("date"),
      /**
       * Links a log message to a status code.
       */
      hasCode: _NS$m("hasCode"),
      /**
       * logLevel
       */
      level: _NS$m("level"),
      /**
       * Logging message
       */
      message: _NS$m("message"),
      /**
       * If we mix normal and log output, this can be used to refer to the resource in the RDF the error is connected to.
       */
      resource: _NS$m("resource"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$l = new rdfDataFactory.DataFactory();
  function _NS$l(localName) {
      return rdfFactory$l.namedNode("http://xmlns.com/foaf/0.1/" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Friend of a friend, v0.99
   */
  var FOAF = {
      PREFIX: "foaf",
      NAMESPACE: "http://xmlns.com/foaf/0.1/",
      PREFIX_AND_NAMESPACE: { "foaf": "http://xmlns.com/foaf/0.1/" },
      NS: _NS$l,
      // *****************
      // All the Classes.
      // *****************
      /**
       * An agent (eg. person, group, software or physical artifact).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Agent: _NS$l("Agent"),
      /**
       * A document.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Document: _NS$l("Document"),
      /**
       * An organization.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Organization: _NS$l("Organization"),
      /**
       * A project (a collective endeavour of some kind).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Project: _NS$l("Project"),
      /**
       * A class of Agents.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Group: _NS$l("Group"),
      /**
       * An image.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Image: _NS$l("Image"),
      /**
       * A foaf:LabelProperty is any RDF property with texual values that serve as labels.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      LabelProperty: _NS$l("LabelProperty"),
      /**
       * An online account.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      OnlineAccount: _NS$l("OnlineAccount"),
      /**
       * An online chat account.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      OnlineChatAccount: _NS$l("OnlineChatAccount"),
      /**
       * An online e-commerce account.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      OnlineEcommerceAccount: _NS$l("OnlineEcommerceAccount"),
      /**
       * An online gaming account.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      OnlineGamingAccount: _NS$l("OnlineGamingAccount"),
      /**
       * A person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      Person: _NS$l("Person"),
      /**
       * A personal profile RDF document.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      PersonalProfileDocument: _NS$l("PersonalProfileDocument"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Indicates an account held by this agent.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      account: _NS$l("account"),
      /**
       * Indicates the name (identifier) associated with this online account.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      accountName: _NS$l("accountName"),
      /**
       * Indicates a homepage of the service provide for this online account.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      accountServiceHomepage: _NS$l("accountServiceHomepage"),
      /**
       * The age in years of some agent.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      age: _NS$l("age"),
      /**
       * An AIM chat ID
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      aimChatID: _NS$l("aimChatID"),
      /**
       * A short informal nickname characterising an agent (includes login identifiers, IRC and other chat nicknames).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      nick: _NS$l("nick"),
      /**
       * A location that something is based near, for some broadly human notion of near.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      based_near: _NS$l("based_near"),
      /**
       * The birthday of this Agent, represented in mm-dd string form, eg. '12-31'.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      birthday: _NS$l("birthday"),
      /**
       * A current project this person works on.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      currentProject: _NS$l("currentProject"),
      /**
       * A depiction of some thing.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      depiction: _NS$l("depiction"),
      /**
       * A thing depicted in this representation.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      depicts: _NS$l("depicts"),
      /**
       * A checksum for the DNA of some thing. Joke.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      dnaChecksum: _NS$l("dnaChecksum"),
      /**
       * The family name of some person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      familyName: _NS$l("familyName"),
      /**
       * The family name of some person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      family_name: _NS$l("family_name"),
      /**
       * The first name of a person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      firstName: _NS$l("firstName"),
      /**
       * The underlying or 'focal' entity associated with some SKOS-described concept.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      focus: _NS$l("focus"),
      /**
       * An organization funding a project or person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      fundedBy: _NS$l("fundedBy"),
      /**
       * A textual geekcode for this person, see http://www.geekcode.com/geek.html
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      geekcode: _NS$l("geekcode"),
      /**
       * The gender of this Agent (typically but not necessarily 'male' or 'female').
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      gender: _NS$l("gender"),
      /**
       * The given name of some person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      givenName: _NS$l("givenName"),
      /**
       * The given name of some person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      givenname: _NS$l("givenname"),
      /**
       * Indicates an account held by this agent.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      holdsAccount: _NS$l("holdsAccount"),
      /**
       * A homepage for some thing.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      homepage: _NS$l("homepage"),
      /**
       * A page or document about this thing.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      page: _NS$l("page"),
      /**
       * A document that this thing is the primary topic of.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      isPrimaryTopicOf: _NS$l("isPrimaryTopicOf"),
      /**
       * An ICQ chat ID
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      icqChatID: _NS$l("icqChatID"),
      /**
       * An image that can be used to represent some thing (ie. those depictions which are particularly representative of something, eg. one's photo on a homepage).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      img: _NS$l("img"),
      /**
       * A page about a topic of interest to this person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      interest: _NS$l("interest"),
      /**
       * The primary topic of some page or document.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      primaryTopic: _NS$l("primaryTopic"),
      /**
       * A jabber ID for something.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      jabberID: _NS$l("jabberID"),
      /**
       * A person known by this person (indicating some level of reciprocated interaction between the parties).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      knows: _NS$l("knows"),
      /**
       * The last name of a person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      lastName: _NS$l("lastName"),
      /**
       * A logo representing some thing.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      logo: _NS$l("logo"),
      /**
       * Something that was made by this agent.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      made: _NS$l("made"),
      /**
       * An agent that made this thing.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      maker: _NS$l("maker"),
      /**
       * A personal mailbox, ie. an Internet mailbox associated with exactly one owner, the first owner of this mailbox. This is a 'static inverse functional property', in that there is (across time and change) at most one individual that ever has any particular value for foaf:mbox.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      mbox: _NS$l("mbox"),
      /**
       * The sha1sum of the URI of an Internet mailbox associated with exactly one owner, the first owner of the mailbox.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      mbox_sha1sum: _NS$l("mbox_sha1sum"),
      /**
       * Indicates a member of a Group
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      member: _NS$l("member"),
      /**
       * Indicates the class of individuals that are a member of a Group
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      membershipClass: _NS$l("membershipClass"),
      /**
       * An MSN chat ID
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      msnChatID: _NS$l("msnChatID"),
      /**
       * A Myers Briggs (MBTI) personality classification.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      myersBriggs: _NS$l("myersBriggs"),
      /**
       * A name for some thing.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      name: _NS$l("name"),
      /**
       * An OpenID for an Agent.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      openid: _NS$l("openid"),
      /**
       * A topic of some page or document.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      topic: _NS$l("topic"),
      /**
       * A project this person has previously worked on.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      pastProject: _NS$l("pastProject"),
      /**
       * A phone, specified using fully qualified tel: URI scheme (refs: http://www.w3.org/Addressing/schemes.html#tel).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      phone: _NS$l("phone"),
      /**
       * A .plan comment, in the tradition of finger and '.plan' files.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      plan: _NS$l("plan"),
      /**
       * A link to the publications of this person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      publications: _NS$l("publications"),
      /**
       * A homepage of a school attended by the person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      schoolHomepage: _NS$l("schoolHomepage"),
      /**
       * A sha1sum hash, in hex.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      sha1: _NS$l("sha1"),
      /**
       * A Skype ID
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      skypeID: _NS$l("skypeID"),
      /**
       * A string expressing what the user is happy for the general public (normally) to know about their current activity.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      status: _NS$l("status"),
      /**
       * The surname of some person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      surname: _NS$l("surname"),
      /**
       * A theme.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      theme: _NS$l("theme"),
      /**
       * A derived thumbnail image.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      thumbnail: _NS$l("thumbnail"),
      /**
       * A tipjar document for this agent, describing means for payment and reward.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      tipjar: _NS$l("tipjar"),
      /**
       * Title (Mr, Mrs, Ms, Dr. etc)
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      title: _NS$l("title"),
      /**
       * A thing of interest to this person.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      topic_interest: _NS$l("topic_interest"),
      /**
       * A weblog of some thing (whether person, group, company etc.).
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      weblog: _NS$l("weblog"),
      /**
       * A work info homepage of some person; a page about their work for some organization.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      workInfoHomepage: _NS$l("workInfoHomepage"),
      /**
       * A workplace homepage of some person; the homepage of an organization they work for.
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      workplaceHomepage: _NS$l("workplaceHomepage"),
      /**
       * A Yahoo chat ID
       *
       * Defined by the vocabulary: http://xmlns.com/foaf/0.1/
       */
      yahooChatID: _NS$l("yahooChatID"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$k = new rdfDataFactory.DataFactory();
  function _NS$k(localName) {
      return rdfFactory$k.namedNode("http://purl.org/linked-data/cube#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * This vocabulary allows multi-dimensional data, such as statistics, to be published in RDF. It is based on the core information model from SDMX (and thus also DDI).
   */
  var QB = {
      PREFIX: "qb",
      NAMESPACE: "http://purl.org/linked-data/cube#",
      PREFIX_AND_NAMESPACE: { "qb": "http://purl.org/linked-data/cube#" },
      NS: _NS$k,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Represents a collection of observations, possibly organized into various slices, conforming to some common dimensional structure.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      DataSet: _NS$k("DataSet"),
      /**
       * Abstract superclass for everything that can have attributes and dimensions
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      Attachable: _NS$k("Attachable"),
      /**
       * A single observation in the cube, may have one or more associated measured values
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      Observation: _NS$k("Observation"),
      /**
       * A, possibly arbitrary, group of observations.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      ObservationGroup: _NS$k("ObservationGroup"),
      /**
       * Denotes a subset of a DataSet defined by fixing a subset of the dimensional values, component properties on the Slice
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      Slice: _NS$k("Slice"),
      /**
       * Abstract super-property of all properties representing dimensions, attributes or measures
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      ComponentProperty: _NS$k("ComponentProperty"),
      /**
       * The class of components which represent the dimensions of the cube
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      DimensionProperty: _NS$k("DimensionProperty"),
      /**
       * Superclass of all coded ComponentProperties
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      CodedProperty: _NS$k("CodedProperty"),
      /**
       * The class of components which represent the measured value of the phenomenon being observed
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      MeasureProperty: _NS$k("MeasureProperty"),
      /**
       * The class of components which represent attributes of observations in the cube, e.g. unit of measurement
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      AttributeProperty: _NS$k("AttributeProperty"),
      /**
       * Defines the structure of a DataSet or slice
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      DataStructureDefinition: _NS$k("DataStructureDefinition"),
      /**
       * Abstract class of things which reference one or more ComponentProperties
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      ComponentSet: _NS$k("ComponentSet"),
      /**
       * Used to define properties of a component (attribute, dimension etc) which are specific to its usage in a DSD.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      ComponentSpecification: _NS$k("ComponentSpecification"),
      /**
       * Denotes a subset of the component properties of a DataSet which are fixed in the corresponding slices
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      SliceKey: _NS$k("SliceKey"),
      /**
       * Represents a generalized hierarchy of concepts which can be used for coding. The hierarchy is defined by one or more roots together with a property which relates concepts in the hierarchy to thier child concept .  The same concepts may be members of multiple hierarchies provided that different qb:parentChildProperty values are used for each hierarchy.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      HierarchicalCodeList: _NS$k("HierarchicalCodeList"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * indicates the data set of which this observation is a part
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      dataSet: _NS$k("dataSet"),
      /**
       * indicates a observation contained within this slice of the data set
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      observation: _NS$k("observation"),
      /**
       * Indicates a group of observations. The domain of this property is left open so that a group may be attached to different resources and need not be restricted to a single DataSet
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      observationGroup: _NS$k("observationGroup"),
      /**
       * Indicates a subset of a DataSet defined by fixing a subset of the dimensional values
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      slice: _NS$k("slice"),
      /**
       * Generic measure dimension, the value of this dimension indicates which measure (from the set of measures in the DSD) is being given by the obsValue (or other primary measure)
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      measureType: _NS$k("measureType"),
      /**
       * indicates the structure to which this data set conforms
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      structure: _NS$k("structure"),
      /**
       * indicates a component specification which is included in the structure of the dataset
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      component: _NS$k("component"),
      /**
       * indicates a ComponentProperty (i.e. attribute/dimension) expected on a DataSet, or a dimension fixed in a SliceKey
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      componentProperty: _NS$k("componentProperty"),
      /**
       * indicates a priority order for the components of sets with this structure, used to guide presentations - lower order numbers come before higher numbers, un-numbered components come last
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      order: _NS$k("order"),
      /**
       * Indicates whether a component property is required (true) or optional (false) in the context of a DSD. Only applicable
        to components correspond to an attribute. Defaults to false (optional).
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      componentRequired: _NS$k("componentRequired"),
      /**
       * Indicates the level at which the component property should be attached, this might an qb:DataSet, qb:Slice or qb:Observation, or a qb:MeasureProperty.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      componentAttachment: _NS$k("componentAttachment"),
      /**
       * An alternative to qb:componentProperty which makes explicit that the component is a dimension
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      dimension: _NS$k("dimension"),
      /**
       * An alternative to qb:componentProperty which makes explicit that the component is a measure
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      measure: _NS$k("measure"),
      /**
       * An alternative to qb:componentProperty which makes explicit that the component is a attribute
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      attribute: _NS$k("attribute"),
      /**
       * An alternative to qb:componentProperty which makes explicit that the component is a measure dimension
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      measureDimension: _NS$k("measureDimension"),
      /**
       * indicates the sub-key corresponding to this slice
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      sliceStructure: _NS$k("sliceStructure"),
      /**
       * indicates a slice key which is used for slices in this dataset
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      sliceKey: _NS$k("sliceKey"),
      /**
       * gives the concept which is being measured or indicated by a ComponentProperty
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      concept: _NS$k("concept"),
      /**
       * gives the code list associated with a CodedProperty
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      codeList: _NS$k("codeList"),
      /**
       * Specifies a root of the hierarchy. A hierarchy may have multiple roots but must have at least one.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      hierarchyRoot: _NS$k("hierarchyRoot"),
      /**
       * Specifies a property which relates a parent concept in the hierarchy to a child concept.
       *
       * Defined by the vocabulary: http://purl.org/linked-data/cube
       */
      parentChildProperty: _NS$k("parentChildProperty"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$j = new rdfDataFactory.DataFactory();
  function _NS$j(localName) {
      return rdfFactory$j.namedNode("http://purl.org/linked-data/sdmx/2009/dimension#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - SDMX Dimension Vocabulary
   */
  var SDMX_DIMENSION = {
      PREFIX: "sdmx-dimension",
      NAMESPACE: "http://purl.org/linked-data/sdmx/2009/dimension#",
      PREFIX_AND_NAMESPACE: { "sdmx-dimension": "http://purl.org/linked-data/sdmx/2009/dimension#" },
      NS: _NS$j,
      // *******************
      // All the Properties.
      // *******************
      /**
       * The length of time that a person has lived or a thing has existed.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      age: _NS$j("age"),
      /**
       * Legal, conjugal status of each individual in relation to the marriage laws or customs of the country.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      civilStatus: _NS$j("civilStatus"),
      /**
       * Monetary denomination of the object being measured.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      currency: _NS$j("currency"),
      /**
       * The highest level of an educational programme the person has successfully completed.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      educationLev: _NS$j("educationLev"),
      /**
       * The time interval at which observations occur over a given time period.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      freq: _NS$j("freq"),
      /**
       * Job or position held by an individual who performs a set of tasks and duties.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      occupation: _NS$j("occupation"),
      /**
       * The country or geographic area to which the measured statistical phenomenon relates.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      refArea: _NS$j("refArea"),
      /**
       * The period of time or point in time to which the measured observation is intended to refer.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      refPeriod: _NS$j("refPeriod"),
      /**
       * The state of being male or female.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      sex: _NS$j("sex"),
      /**
       * The period of time or point in time to which the measured observation refers.
       *
       * Defined by the vocabulary: https://sdmx.org/wp-content/uploads/01_sdmx_cog_annex_1_cdc_2009.pdf
       */
      timePeriod: _NS$j("timePeriod"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$i = new rdfDataFactory.DataFactory();
  function _NS$i(localName) {
      return rdfFactory$i.namedNode("http://www.w3.org/ns/shex#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Shape Expressions (ShEx) - for validating RDF
   */
  var SHEX = {
      PREFIX: "shex",
      NAMESPACE: "http://www.w3.org/ns/shex#",
      PREFIX_AND_NAMESPACE: { "shex": "http://www.w3.org/ns/shex#" },
      NS: _NS$i,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Annotations provide a format-independent way to provide additional information about elements in a schema.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      Annotation: _NS$i("Annotation"),
      /**
       * A TripleExpression composed of one or more sub-expressions, all of which must match.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      EachOf: _NS$i("EachOf"),
      /**
       * The abstract class of Triple Expressions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      TripleExpression: _NS$i("TripleExpression"),
      /**
       * An IRI prefix used for matching IRIs.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      IriStem: _NS$i("IriStem"),
      /**
       * Abstract class for Stems
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      Stem: _NS$i("Stem"),
      /**
       * An IRI prefix (or wildcard) along with a set of excluded values, used for node matching.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      IriStemRange: _NS$i("IriStemRange"),
      /**
       * Abstract Class for Stem Ranges
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      StemRange: _NS$i("StemRange"),
      /**
       * An Language tag used for matching Literal Languages.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      Language: _NS$i("Language"),
      /**
       * An Language prefix used for matching Literal Languages.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      LanguageStem: _NS$i("LanguageStem"),
      /**
       * An Language prefix (or wildcard) along with a set of excluded values, used for node matching.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      LanguageStemRange: _NS$i("LanguageStemRange"),
      /**
       * An Literal prefix used for matching Literals.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      LiteralStem: _NS$i("LiteralStem"),
      /**
       * An Literal prefix (or wildcard) along with a set of excluded values, used for node matching.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      LiteralStemRange: _NS$i("LiteralStemRange"),
      /**
       * A constraint on the type or value of an RDF Node.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      NodeConstraint: _NS$i("NodeConstraint"),
      /**
       * The abstract class of Shape Expressions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      ShapeExpression: _NS$i("ShapeExpression"),
      /**
       * The set of kinds of RDF Nodes.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      NodeKind: _NS$i("NodeKind"),
      /**
       * A TripleExpression composed of one or more sub-expressions, one of which must match.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      OneOf: _NS$i("OneOf"),
      /**
       * A Schema contains the set of shapes, used for matching a focus node.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      Schema: _NS$i("Schema"),
      /**
       * A list of Semantic Actions that serve as an extension point for Shape Expressions. They appear in lists in Schema's startActs and Shape, OneOf, EachOf and TripleConstraint's semActs.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      SemAct: _NS$i("SemAct"),
      /**
       * A shapes schema is captured in a Schema object where shapes is a mapping from shape label to shape expression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      Shape: _NS$i("Shape"),
      /**
       * A ShapeExpression composed of one or more sub-expressions, all of which must match.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      ShapeAnd: _NS$i("ShapeAnd"),
      /**
       * A reference to a shape defined in some external Schema.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      ShapeExternal: _NS$i("ShapeExternal"),
      /**
       * A ShapeNot is satisfied when it’s included ShapeExpression is not satisfied.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      ShapeNot: _NS$i("ShapeNot"),
      /**
       * A ShapeExpression composed of one or more sub-expressions, one of which must match.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      ShapeOr: _NS$i("ShapeOr"),
      /**
       * A constraint on a triple having a specific predicate and optionally a shape expression used for matching values.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      TripleConstraint: _NS$i("TripleConstraint"),
      /**
       * Indicates that a stem is a Wildcard, rather than a URI prefix.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      Wildcard: _NS$i("Wildcard"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Annotations on a TripleExpression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      annotation: _NS$i("annotation"),
      /**
       * Indicates that a Shape is closed, meaning that it may contain no property values other than those used within TripleConstraints.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      closed: _NS$i("closed"),
      /**
       * Code executed by Semantic Action.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      code: _NS$i("code"),
      /**
       * A datatype constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      datatype: _NS$i("datatype"),
      /**
       * Values that are excluded from value matching.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      exclusion: _NS$i("exclusion"),
      /**
       * Expression associated with the TripleExpression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      expression: _NS$i("expression"),
      /**
       * List of 2 or more expressions associated with the TripleExpression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      expressions: _NS$i("expressions"),
      /**
       * Properties which may have extra values beyond those matched through a constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      extra: _NS$i("extra"),
      /**
       * Regular expression flags
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      flags: _NS$i("flags"),
      /**
       * for "fractiondigits" constraints, v is less than or equals the number of digits to the right of the decimal place in the XML Schema canonical form[xmlschema-2] of the value of n, ignoring trailing zeros.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      fractiondigits: _NS$i("fractiondigits"),
      /**
       * Abstract property of numeric facets on a NodeConstraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      numericFacet: _NS$i("numericFacet"),
      /**
       * Constrains the subject of a triple, rather than the object.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      inverse: _NS$i("inverse"),
      /**
       * The value used to match the language tag of a language-tagged string.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      languageTag: _NS$i("languageTag"),
      /**
       * The exact length of the value of the cell.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      length: _NS$i("length"),
      /**
       * An abstract property of string facets on a NodeConstraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      stringFacet: _NS$i("stringFacet"),
      /**
       * Maximum number of times this TripleExpression may match; -1 for “*”
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      max: _NS$i("max"),
      /**
       * An atomic property that contains a single number that is the maximum valid value (exclusive).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      maxexclusive: _NS$i("maxexclusive"),
      /**
       * An atomic property that contains a single number that is the maximum valid value (inclusive).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      maxinclusive: _NS$i("maxinclusive"),
      /**
       * A numeric atomic property that contains a single integer that is the maximum length of the value.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      maxlength: _NS$i("maxlength"),
      /**
       * Minimum number of times this TripleExpression may match.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      min: _NS$i("min"),
      /**
       * An atomic property that contains a single number that is the minimum valid value (exclusive).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      minexclusive: _NS$i("minexclusive"),
      /**
       * An atomic property that contains a single number that is the minimum valid value (inclusive).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      mininclusive: _NS$i("mininclusive"),
      /**
       * An atomic property that contains a single integer that is the minimum length of the value.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      minlength: _NS$i("minlength"),
      /**
       * Identifier of SemAct extension.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      name: _NS$i("name"),
      /**
       * Restiction on the kind of node matched; restricted to the defined instances of NodeKind. One of shex:iri, shex:bnode, shex:literal, or shex:nonliteral.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      nodeKind: _NS$i("nodeKind"),
      /**
       * An abstract property of string and numeric facets on a NodeConstraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      xsFacet: _NS$i("xsFacet"),
      /**
       * The object of an Annotation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      object: _NS$i("object"),
      /**
       * A regular expression used for matching a value.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      pattern: _NS$i("pattern"),
      /**
       * The predicate of a TripleConstraint or Annotation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      predicate: _NS$i("predicate"),
      /**
       * Semantic Actions on this TripleExpression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      semActs: _NS$i("semActs"),
      /**
       * Shape Expression referenced by this shape.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      shapeExpr: _NS$i("shapeExpr"),
      /**
       * A list of 2 or more Shape Expressions referenced by this shape.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      shapeExprs: _NS$i("shapeExprs"),
      /**
       * Shapes in this Schema.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      shapes: _NS$i("shapes"),
      /**
       * A ShapeExpression matched against the focus node prior to any other mapped expressions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      start: _NS$i("start"),
      /**
       * Semantic Actions run on the Schema.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      startActs: _NS$i("startActs"),
      /**
       * A stem value used for matching or excluding values.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      stem: _NS$i("stem"),
      /**
       * for "totaldigits" constraints, v equals the number of digits in the XML Schema canonical form[xmlschema-2] of the value of n
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      totaldigits: _NS$i("totaldigits"),
      /**
       * A ShapeExpression used for matching the object (or subject if inverted) of a TripleConstraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      valueExpr: _NS$i("valueExpr"),
      /**
       * A value restriction on a NodeConstraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/shex#
       */
      values: _NS$i("values"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$h = new rdfDataFactory.DataFactory();
  function _NS$h(localName) {
      return rdfFactory$h.namedNode("http://www.w3.org/ns/auth/acl#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Web Access Control Vocabulary
   */
  var ACL = {
      PREFIX: "acl",
      NAMESPACE: "http://www.w3.org/ns/auth/acl#",
      PREFIX_AND_NAMESPACE: { "acl": "http://www.w3.org/ns/auth/acl#" },
      NS: _NS$h,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Any kind of access to a resource. Don't use this, use R W and RW
       */
      Access: _NS$h("Access"),
      /**
       * Append accesses are specific write access which only add information, and do not remove information.
        For text files, for example, append access allows bytes to be added onto the end of the file.
        For RDF graphs, Append access allows adds triples to the graph but does not remove any.
        Append access is useful for dropbox functionality.
        Dropbox can be used for link notification, which the information added is a notification
        that a some link has been made elsewhere relevant to the given resource.
        
       */
      Append: _NS$h("Append"),
      /**
       * write
       */
      Write: _NS$h("Write"),
      /**
       * A class of agents who have been authenticated.
    In other words, anyone can access this resource, but not anonymously.
    The social expectation is that the authentication process will provide an
    identify and a name, or pseudonym.
    (A new ID should not be minted for every access: the intent is that the user
    is able to continue to use the ID for continues interactions with peers,
    and for example to develop a reputation)
    
       */
      AuthenticatedAgent: _NS$h("AuthenticatedAgent"),
      /**
       * An element of access control,
        allowing agent to agents access of some kind to resources or classes of resources
       */
      Authorization: _NS$h("Authorization"),
      /**
       * Allows read/write access to the ACL for the resource(s)
       */
      Control: _NS$h("Control"),
      /**
       * An Origin is basically a web site
            (Note WITHOUT the trailing slash after the domain name and port in its URI)
            and is the basis for controlling access to data by web apps
            in the Same Origin Model of web security.
            All scripts from the same origin are given the same right.
       *
       * See also:
       *  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
       */
      Origin: _NS$h("Origin"),
      /**
       * The class of read operations
       */
      Read: _NS$h("Read"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The Access Control file for this information resource.
            This may of course be a virtual resource implemented by the access control system.
            Note also HTTP's header  Link:  foo.meta ;rel=meta can be used for this.
       */
      accessControl: _NS$h("accessControl"),
      /**
       * The information resource to which access is being granted.
       */
      accessTo: _NS$h("accessTo"),
      /**
       * A class of information resources to which access is being granted.
       */
      accessToClass: _NS$h("accessToClass"),
      /**
       * A person or social entity to being given the right
       */
      agent: _NS$h("agent"),
      /**
       * A class of persons or social entities to being given the right
       */
      agentClass: _NS$h("agentClass"),
      /**
       * A group of persons or social entities to being given the right.
              The right is given to any entity which is a vcard:member of the group,
              as defined by the document received when the Group is dereferenced.
       */
      agentGroup: _NS$h("agentGroup"),
      /**
       * If a resource has no ACL file (it is 404),
            then access to the resource if given by the ACL of the immediately
            containing directory, or failing that (404) the ACL of the recursively next
            containing directory which has an ACL file.
            Within that ACL file,
            any Authentication which has that directory as its acl:default applies to the
            resource. (The highest directory must have an ACL file.)
    
       */
      default: _NS$h("default"),
      /**
       * THIS IS OBSOLETE AS OF 2017-08-01.   See 'default'.
            Was: A directory for which this authorization is used for new files in the directory.
       */
      defaultForNew: _NS$h("defaultForNew"),
      /**
       * Delegates a person or another agent to act on behalf of the agent.
        For example, Alice delegates Bob to act on behalf of Alice for ACL purposes.
       */
      delegates: _NS$h("delegates"),
      /**
       * A mode of access such as read or write.
       */
      mode: _NS$h("mode"),
      /**
       * A web application, identified by its Origin, such as
            <https://scripts.example.com>, being given the right.
            When a user of the web application at a certain origin accesses the server,
            then the browser sets the Origin: header to warn that a possibly untrusted webapp
            is being used.
            Then, BOTH the user AND the origin must have the required access.
       *
       * See also:
       *  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
       */
      origin: _NS$h("origin"),
      /**
       * The person or other agent which owns this.
        For example, the owner of a file in a filesystem.
        There is a sense of right to control.   Typically defaults to the agent who craeted
        something but can be changed.
       */
      owner: _NS$h("owner"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$g = new rdfDataFactory.DataFactory();
  function _NS$g(localName) {
      return rdfFactory$g.namedNode("http://www.w3.org/ns/posix/stat#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * A vocabulary for the basic POSIX terms.
   */
  var POSIX = {
      PREFIX: "posix",
      NAMESPACE: "http://www.w3.org/ns/posix/stat#",
      PREFIX_AND_NAMESPACE: { "posix": "http://www.w3.org/ns/posix/stat#" },
      NS: _NS$g,
      // *******************
      // All the Properties.
      // *******************
      /**
       * Time of last access
       */
      atime: _NS$g("atime"),
      /**
       * Blocksize for file system I/O
       */
      blksize: _NS$g("blksize"),
      /**
       * Number of 512B blocks allocated
       */
      blocks: _NS$g("blocks"),
      /**
       * Time of last status change
       */
      ctime: _NS$g("ctime"),
      /**
       * ID of device containing file
       */
      dev: _NS$g("dev"),
      /**
       * Group ID of owner
       */
      gid: _NS$g("gid"),
      /**
       * inode number
       */
      ino: _NS$g("ino"),
      /**
       * Protection
       */
      mode: _NS$g("mode"),
      /**
       * Time of last modification
       */
      mtime: _NS$g("mtime"),
      /**
       * Number of hard links
       */
      nlink: _NS$g("nlink"),
      /**
       * Device ID (if special file)
       */
      rdev: _NS$g("rdev"),
      /**
       * Total size, in bytes
       */
      size: _NS$g("size"),
      /**
       * User ID of owner
       */
      uid: _NS$g("uid"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$f = new rdfDataFactory.DataFactory();
  function _NS$f(localName) {
      return rdfFactory$f.namedNode("https://www.w3.org/2002/12/cal/ical#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - iCal - a vocabulary for description of events and calendars
   */
  var ICAL = {
      PREFIX: "ical",
      NAMESPACE: "https://www.w3.org/2002/12/cal/ical#",
      PREFIX_AND_NAMESPACE: { "ical": "https://www.w3.org/2002/12/cal/ical#" },
      NS: _NS$f,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Provide a grouping of component properties that define an alarm.
       */
      Valarm: _NS$f("Valarm"),
      /**
       *
       */
      Value_CAL_ADDRESS: _NS$f("Value_CAL-ADDRESS"),
      /**
       *
       */
      Value_DATE: _NS$f("Value_DATE"),
      /**
       *
       */
      Value_DATE_TIME: _NS$f("Value_DATE-TIME"),
      /**
       *
       */
      Value_DURATION: _NS$f("Value_DURATION"),
      /**
       *
       */
      Value_PERIOD: _NS$f("Value_PERIOD"),
      /**
       *
       */
      Value_RECUR: _NS$f("Value_RECUR"),
      /**
       * Provide a grouping of component properties that describe an event.
       */
      Vevent: _NS$f("Vevent"),
      /**
       * Provide a grouping of component properties that describe either a request for free/busy time, describe a response to a request for free/busy time or describe a published set of busy time.
       */
      Vfreebusy: _NS$f("Vfreebusy"),
      /**
       * Provide a grouping of component properties that describe a journal entry.
       */
      Vjournal: _NS$f("Vjournal"),
      /**
       * Provide a grouping of component properties that defines a time zone.
       */
      Vtimezone: _NS$f("Vtimezone"),
      /**
       * Provide a grouping of calendar properties that describe a to-do.
       */
      Vtodo: _NS$f("Vtodo"),
      // *******************
      // All the Properties.
      // *******************
      /**
       *
            default value type: URI
       */
      attach: _NS$f("attach"),
      /**
       *
            value type: TEXT
       */
      description: _NS$f("description"),
      /**
       *
            value type: TEXT
       */
      summary: _NS$f("summary"),
      /**
       *
            value type: DURATION
       */
      duration: _NS$f("duration"),
      /**
       *
            value type: CAL-ADDRESS
       */
      attendee: _NS$f("attendee"),
      /**
       *
            value type: TEXT
       */
      action: _NS$f("action"),
      /**
       *
            value type: INTEGER
       */
      repeat: _NS$f("repeat"),
      /**
       *
            default value type: DURATION
       */
      trigger: _NS$f("trigger"),
      /**
       *
            value type: TEXT
       */
      categories: _NS$f("categories"),
      /**
       *
            value type: TEXT
       */
      class: _NS$f("class"),
      /**
       *
            value type: TEXT
       */
      comment: _NS$f("comment"),
      /**
       * This property specifies information related to the global position for the activity specified by a calendar component.
       */
      geo: _NS$f("geo"),
      /**
       *
            value type: TEXT
       */
      location: _NS$f("location"),
      /**
       *
            value type: INTEGER
       */
      priority: _NS$f("priority"),
      /**
       *
            value type: TEXT
       */
      resources: _NS$f("resources"),
      /**
       *
            value type: TEXT
       */
      status: _NS$f("status"),
      /**
       *
            default value type: DATE-TIME
       */
      dtend: _NS$f("dtend"),
      /**
       *
            default value type: DATE-TIME
       */
      dtstart: _NS$f("dtstart"),
      /**
       *
            value type: TEXT
       */
      transp: _NS$f("transp"),
      /**
       *
            value type: TEXT
       */
      contact: _NS$f("contact"),
      /**
       *
            value type: CAL-ADDRESS
       */
      organizer: _NS$f("organizer"),
      /**
       *
            value type: TEXT
       */
      relatedTo: _NS$f("relatedTo"),
      /**
       *
            value type: URI
       */
      url: _NS$f("url"),
      /**
       *
            value type: TEXT
       */
      uid: _NS$f("uid"),
      /**
       *
            value type: RECUR
       */
      exrule: _NS$f("exrule"),
      /**
       *
            default value type: DATE-TIME
       */
      rdate: _NS$f("rdate"),
      /**
       *
            value type: RECUR
       */
      rrule: _NS$f("rrule"),
      /**
       *
            value type: DATE-TIME
       */
      created: _NS$f("created"),
      /**
       *
            value type: DATE-TIME
       */
      dtstamp: _NS$f("dtstamp"),
      /**
       *
            value type: DATE-TIME
       */
      lastModified: _NS$f("lastModified"),
      /**
       *
            value type: integer
       */
      sequence: _NS$f("sequence"),
      /**
       *
            value type: TEXT
       */
      requestStatus: _NS$f("requestStatus"),
      /**
       *
            value type: PERIOD
       */
      freebusy: _NS$f("freebusy"),
      /**
       *
            value type: TEXT
       */
      tzid: _NS$f("tzid"),
      /**
       *
            value type: TEXT
       */
      tzname: _NS$f("tzname"),
      /**
       *
            value type: UTC-OFFSET
       */
      tzoffsetfrom: _NS$f("tzoffsetfrom"),
      /**
       *
            value type: UTC-OFFSET
       */
      tzoffsetto: _NS$f("tzoffsetto"),
      /**
       *
            value type: URI
       */
      tzurl: _NS$f("tzurl"),
      /**
       *
            value type: INTEGER
       */
      percentComplete: _NS$f("percentComplete"),
      /**
       *
            value type: DATE-TIME
       */
      completed: _NS$f("completed"),
      /**
       *
            default value type: DATE-TIME
       */
      due: _NS$f("due"),
      /**
       *
            value type: TEXT
       */
      X_: _NS$f("X-"),
      /**
       *
            value type: TEXT
       */
      calscale: _NS$f("calscale"),
      /**
       *
            default value type: DATE-TIME
       */
      exdate: _NS$f("exdate"),
      /**
       *
            value type: TEXT
       */
      method: _NS$f("method"),
      /**
       *
            value type: TEXT
       */
      prodid: _NS$f("prodid"),
      /**
       *
            default value type: DATE-TIME
       */
      recurrenceId: _NS$f("recurrenceId"),
      /**
       *
            value type: TEXT
       */
      version: _NS$f("version"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$e = new rdfDataFactory.DataFactory();
  function _NS$e(localName) {
      return rdfFactory$e.namedNode("http://www.w3.org/ns/prov#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * This document is published by the Provenance Working Group (http://www.w3.org/2011/prov/wiki/Main_Page).

  If you wish to make comments regarding this document, please send them to public-prov-comments@w3.org (subscribe public-prov-comments-request@w3.org, archives http://lists.w3.org/Archives/Public/public-prov-comments/). All feedback is welcome.
   */
  var PROV_O = {
      PREFIX: "prov-o",
      NAMESPACE: "http://www.w3.org/ns/prov#",
      PREFIX_AND_NAMESPACE: { "prov-o": "http://www.w3.org/ns/prov#" },
      NS: _NS$e,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Activity
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Activity: _NS$e("Activity"),
      /**
       * Entity
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Entity: _NS$e("Entity"),
      /**
       * ActivityInfluence provides additional descriptions of an Activity's binary influence upon any other kind of resource. Instances of ActivityInfluence use the prov:activity property to cite the influencing Activity.
       *
       * See also:
       *  - http://www.w3.org/ns/prov#activity
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      ActivityInfluence: _NS$e("ActivityInfluence"),
      /**
       * An instance of prov:Influence provides additional descriptions about the binary prov:wasInfluencedBy relation from some influenced Activity, Entity, or Agent to the influencing Activity, Entity, or Agent. For example, :stomach_ache prov:wasInfluencedBy :spoon; prov:qualifiedInfluence [ a prov:Influence; prov:entity :spoon; :foo :bar ] . Because prov:Influence is a broad relation, the more specific relations (Communication, Delegation, End, etc.) should be used when applicable.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Influence: _NS$e("Influence"),
      /**
       * EntityInfluence provides additional descriptions of an Entity's binary influence upon any other kind of resource. Instances of EntityInfluence use the prov:entity property to cite the influencing Entity.
       *
       * See also:
       *  - http://www.w3.org/ns/prov#entity
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      EntityInfluence: _NS$e("EntityInfluence"),
      /**
       * Agent
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Agent: _NS$e("Agent"),
      /**
       * An instantaneous event, or event for short, happens in the world and marks a change in the world, in its activities and in its entities. The term 'event' is commonly used in process algebra with a similar meaning. Events represent communications or interactions; they are assumed to be atomic and instantaneous.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      InstantaneousEvent: _NS$e("InstantaneousEvent"),
      /**
       * AgentInfluence provides additional descriptions of an Agent's binary influence upon any other kind of resource. Instances of AgentInfluence use the prov:agent property to cite the influencing Agent.
       *
       * See also:
       *  - http://www.w3.org/ns/prov#agent
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      AgentInfluence: _NS$e("AgentInfluence"),
      /**
       * An instance of prov:Association provides additional descriptions about the binary prov:wasAssociatedWith relation from an prov:Activity to some prov:Agent that had some responsiblity for it. For example, :baking prov:wasAssociatedWith :baker; prov:qualifiedAssociation [ a prov:Association; prov:agent :baker; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Association: _NS$e("Association"),
      /**
       * An instance of prov:Attribution provides additional descriptions about the binary prov:wasAttributedTo relation from an prov:Entity to some prov:Agent that had some responsible for it. For example, :cake prov:wasAttributedTo :baker; prov:qualifiedAttribution [ a prov:Attribution; prov:entity :baker; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Attribution: _NS$e("Attribution"),
      /**
       * Note that there are kinds of bundles (e.g. handwritten letters, audio recordings, etc.) that are not expressed in PROV-O, but can be still be described by PROV-O.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Bundle: _NS$e("Bundle"),
      /**
       * Collection
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Collection: _NS$e("Collection"),
      /**
       * An instance of prov:Communication provides additional descriptions about the binary prov:wasInformedBy relation from an informed prov:Activity to the prov:Activity that informed it. For example, :you_jumping_off_bridge prov:wasInformedBy :everyone_else_jumping_off_bridge; prov:qualifiedCommunication [ a prov:Communication; prov:activity :everyone_else_jumping_off_bridge; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Communication: _NS$e("Communication"),
      /**
       * An instance of prov:Delegation provides additional descriptions about the binary prov:actedOnBehalfOf relation from a performing prov:Agent to some prov:Agent for whom it was performed. For example, :mixing prov:wasAssociatedWith :toddler . :toddler prov:actedOnBehalfOf :mother; prov:qualifiedDelegation [ a prov:Delegation; prov:entity :mother; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Delegation: _NS$e("Delegation"),
      /**
       * An instance of prov:Derivation provides additional descriptions about the binary prov:wasDerivedFrom relation from some derived prov:Entity to another prov:Entity from which it was derived. For example, :chewed_bubble_gum prov:wasDerivedFrom :unwrapped_bubble_gum; prov:qualifiedDerivation [ a prov:Derivation; prov:entity :unwrapped_bubble_gum; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Derivation: _NS$e("Derivation"),
      /**
       * EmptyCollection
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      EmptyCollection: _NS$e("EmptyCollection"),
      /**
       * An instance of prov:End provides additional descriptions about the binary prov:wasEndedBy relation from some ended prov:Activity to an prov:Entity that ended it. For example, :ball_game prov:wasEndedBy :buzzer; prov:qualifiedEnd [ a prov:End; prov:entity :buzzer; :foo :bar; prov:atTime '2012-03-09T08:05:08-05:00'^^xsd:dateTime ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      End: _NS$e("End"),
      /**
       * An instance of prov:Generation provides additional descriptions about the binary prov:wasGeneratedBy relation from a generated prov:Entity to the prov:Activity that generated it. For example, :cake prov:wasGeneratedBy :baking; prov:qualifiedGeneration [ a prov:Generation; prov:activity :baking; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Generation: _NS$e("Generation"),
      /**
       * An instance of prov:Invalidation provides additional descriptions about the binary prov:wasInvalidatedBy relation from an invalidated prov:Entity to the prov:Activity that invalidated it. For example, :uncracked_egg prov:wasInvalidatedBy :baking; prov:qualifiedInvalidation [ a prov:Invalidation; prov:activity :baking; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Invalidation: _NS$e("Invalidation"),
      /**
       * Location
       *
       * See also:
       *  - http://www.w3.org/ns/prov#atLocation
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Location: _NS$e("Location"),
      /**
       * Organization
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Organization: _NS$e("Organization"),
      /**
       * Person
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Person: _NS$e("Person"),
      /**
       * There exist no prescriptive requirement on the nature of plans, their representation, the actions or steps they consist of, or their intended goals. Since plans may evolve over time, it may become necessary to track their provenance, so plans themselves are entities. Representing the plan explicitly in the provenance can be useful for various tasks: for example, to validate the execution as represented in the provenance record, to manage expectation failures, or to provide explanations.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Plan: _NS$e("Plan"),
      /**
       * An instance of prov:PrimarySource provides additional descriptions about the binary prov:hadPrimarySource relation from some secondary prov:Entity to an earlier, primary prov:Entity. For example, :blog prov:hadPrimarySource :newsArticle; prov:qualifiedPrimarySource [ a prov:PrimarySource; prov:entity :newsArticle; :foo :bar ] .
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      PrimarySource: _NS$e("PrimarySource"),
      /**
       * An instance of prov:Quotation provides additional descriptions about the binary prov:wasQuotedFrom relation from some taken prov:Entity from an earlier, larger prov:Entity. For example, :here_is_looking_at_you_kid prov:wasQuotedFrom :casablanca_script; prov:qualifiedQuotation [ a prov:Quotation; prov:entity :casablanca_script; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Quotation: _NS$e("Quotation"),
      /**
       * An instance of prov:Revision provides additional descriptions about the binary prov:wasRevisionOf relation from some newer prov:Entity to an earlier prov:Entity. For example, :draft_2 prov:wasRevisionOf :draft_1; prov:qualifiedRevision [ a prov:Revision; prov:entity :draft_1; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Revision: _NS$e("Revision"),
      /**
       * Role
       *
       * See also:
       *  - http://www.w3.org/ns/prov#hadRole
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Role: _NS$e("Role"),
      /**
       * SoftwareAgent
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      SoftwareAgent: _NS$e("SoftwareAgent"),
      /**
       * An instance of prov:Start provides additional descriptions about the binary prov:wasStartedBy relation from some started prov:Activity to an prov:Entity that started it. For example, :foot_race prov:wasStartedBy :bang; prov:qualifiedStart [ a prov:Start; prov:entity :bang; :foo :bar; prov:atTime '2012-03-09T08:05:08-05:00'^^xsd:dateTime ] .
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Start: _NS$e("Start"),
      /**
       * An instance of prov:Usage provides additional descriptions about the binary prov:used relation from some prov:Activity to an prov:Entity that it used. For example, :keynote prov:used :podium; prov:qualifiedUsage [ a prov:Usage; prov:entity :podium; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      Usage: _NS$e("Usage"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Classify prov-o terms into three categories, including 'starting-point', 'qualifed', and 'extended'. This classification is used by the prov-o html document to gently introduce prov-o terms to its users.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      category: _NS$e("category"),
      /**
       * Classify prov-o terms into six components according to prov-dm, including 'agents-responsibility', 'alternate', 'annotations', 'collections', 'derivations', and 'entities-activities'. This classification is used so that readers of prov-o specification can find its correspondence with the prov-dm specification.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      component: _NS$e("component"),
      /**
       * A reference to the principal section of the PROV-CONSTRAINTS document that describes this concept.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      constraints: _NS$e("constraints"),
      /**
       * A definition quoted from PROV-DM or PROV-CONSTRAINTS that describes the concept expressed with this OWL term.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      definition: _NS$e("definition"),
      /**
       * A reference to the principal section of the PROV-DM document that describes this concept.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      dm: _NS$e("dm"),
      /**
       * A reference to the principal section of the PROV-DM document that describes this concept.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      n: _NS$e("n"),
      /**
       * activity
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      activity: _NS$e("activity"),
      /**
       * The _optional_ Activity of an Influence, which used, generated, invalidated, or was the responsibility of some Entity. This property is _not_ used by ActivityInfluence (use prov:activity instead).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadActivity: _NS$e("hadActivity"),
      /**
       * When the prov-o term does not have a definition drawn from prov-dm, and the prov-o editor provides one.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      editorsDefinition: _NS$e("editorsDefinition"),
      /**
       * agent
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      agent: _NS$e("agent"),
      /**
       * Classes and properties used to qualify relationships are annotated with prov:unqualifiedForm to indicate the property used to assert an unqualified provenance relation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      unqualifiedForm: _NS$e("unqualifiedForm"),
      /**
       * An prov:Agent that had some (unspecified) responsibility for the occurrence of this prov:Activity.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasAssociatedWith: _NS$e("wasAssociatedWith"),
      /**
       * Attribution is the ascribing of an entity to an agent.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasAttributedTo: _NS$e("wasAttributedTo"),
      /**
       * An activity a2 is dependent on or informed by another activity a1, by way of some unspecified entity that is generated by a1 and used by a2.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasInformedBy: _NS$e("wasInformedBy"),
      /**
       * An object property to express the accountability of an agent towards another agent. The subordinate agent acted on behalf of the responsible agent in an actual activity.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      actedOnBehalfOf: _NS$e("actedOnBehalfOf"),
      /**
       * The more specific subproperties of prov:wasDerivedFrom (i.e., prov:wasQuotedFrom, prov:wasRevisionOf, prov:hadPrimarySource) should be used when applicable.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasDerivedFrom: _NS$e("wasDerivedFrom"),
      /**
       * End is when an activity is deemed to have ended. An end may refer to an entity, known as trigger, that terminated the activity.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasEndedBy: _NS$e("wasEndedBy"),
      /**
       * entity
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      entity: _NS$e("entity"),
      /**
       * wasGeneratedBy
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasGeneratedBy: _NS$e("wasGeneratedBy"),
      /**
       * Because prov:wasInfluencedBy is a broad relation, its more specific subproperties (e.g. prov:wasInformedBy, prov:actedOnBehalfOf, prov:wasEndedBy, etc.) should be used when applicable.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasInfluencedBy: _NS$e("wasInfluencedBy"),
      /**
       * wasInvalidatedBy
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasInvalidatedBy: _NS$e("wasInvalidatedBy"),
      /**
       * The Location of any resource.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      atLocation: _NS$e("atLocation"),
      /**
       * hadPrimarySource
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadPrimarySource: _NS$e("hadPrimarySource"),
      /**
       * An entity is derived from an original entity by copying, or 'quoting', some or all of it.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasQuotedFrom: _NS$e("wasQuotedFrom"),
      /**
       * A revision is a derivation that revises an entity into a revised version.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasRevisionOf: _NS$e("wasRevisionOf"),
      /**
       * The _optional_ Role that an Entity assumed in the context of an Activity. For example, :baking prov:used :spoon; prov:qualified [ a prov:Usage; prov:entity :spoon; prov:hadRole roles:mixing_implement ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadRole: _NS$e("hadRole"),
      /**
       * Start is when an activity is deemed to have started. A start may refer to an entity, known as trigger, that initiated the activity.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      wasStartedBy: _NS$e("wasStartedBy"),
      /**
       * A prov:Entity that was used by this prov:Activity. For example, :baking prov:used :spoon, :egg, :oven .
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      used: _NS$e("used"),
      /**
       * If this Agent prov:actedOnBehalfOf Agent :ag, then it can qualify how with prov:qualifiedResponsibility [ a prov:Responsibility;  prov:agent :ag; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedDelegation: _NS$e("qualifiedDelegation"),
      /**
       * PROV-O does not define all property inverses. The directionalities defined in PROV-O should be given preference over those not defined. However, if users wish to name the inverse of a PROV-O property, the local name given by prov:inverse should be used.
       *
       * See also:
       *  - http://www.w3.org/TR/prov-o/#names-of-inverse-properties
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      inverse: _NS$e("inverse"),
      /**
       * This annotation property links a subproperty of prov:wasInfluencedBy with the subclass of prov:Influence and the qualifying property that are used to qualify it.
    
    Example annotation:
    
        prov:wasGeneratedBy prov:qualifiedForm prov:qualifiedGeneration, prov:Generation .
    
    Then this unqualified assertion:
    
        :entity1 prov:wasGeneratedBy :activity1 .
    
    can be qualified by adding:
    
       :entity1 prov:qualifiedGeneration :entity1Gen .
       :entity1Gen
           a prov:Generation, prov:Influence;
           prov:activity :activity1;
           :customValue 1337 .
    
    Note how the value of the unqualified influence (prov:wasGeneratedBy :activity1) is mirrored as the value of the prov:activity (or prov:entity, or prov:agent) property on the influence class.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedForm: _NS$e("qualifiedForm"),
      /**
       * Subproperties of prov:influencer are used to cite the object of an unqualified PROV-O triple whose predicate is a subproperty of prov:wasInfluencedBy (e.g. prov:used, prov:wasGeneratedBy). prov:influencer is used much like rdf:object is used.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      influencer: _NS$e("influencer"),
      /**
       * A note by the OWL development team about how this term expresses the PROV-DM concept, or how it should be used in context of semantic web or linked data.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      editorialNote: _NS$e("editorialNote"),
      /**
       * alternateOf
       *
       * See also:
       *  - http://www.w3.org/ns/prov#specializationOf
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      alternateOf: _NS$e("alternateOf"),
      /**
       * specializationOf
       *
       * See also:
       *  - http://www.w3.org/ns/prov#alternateOf
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      specializationOf: _NS$e("specializationOf"),
      /**
       *
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      aq: _NS$e("aq"),
      /**
       *
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      sharesDefinitionWith: _NS$e("sharesDefinitionWith"),
      /**
       * The time at which an InstantaneousEvent occurred, in the form of xsd:dateTime.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      atTime: _NS$e("atTime"),
      /**
       * The time at which an activity ended. See also prov:startedAtTime.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      endedAtTime: _NS$e("endedAtTime"),
      /**
       * The time at which an entity was completely created and is available for use.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      generatedAtTime: _NS$e("generatedAtTime"),
      /**
       * The time at which an entity was invalidated (i.e., no longer usable).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      invalidatedAtTime: _NS$e("invalidatedAtTime"),
      /**
       * The time at which an activity started. See also prov:endedAtTime.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      startedAtTime: _NS$e("startedAtTime"),
      /**
       * generated
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      generated: _NS$e("generated"),
      /**
       * influenced
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      influenced: _NS$e("influenced"),
      /**
       * The _optional_ Generation involved in an Entity's Derivation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadGeneration: _NS$e("hadGeneration"),
      /**
       * hadMember
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadMember: _NS$e("hadMember"),
      /**
       * The _optional_ Plan adopted by an Agent in Association with some Activity. Plan specifications are out of the scope of this specification.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadPlan: _NS$e("hadPlan"),
      /**
       * If this Entity prov:hadPrimarySource Entity :e, then it can qualify how using prov:qualifiedPrimarySource [ a prov:PrimarySource; prov:entity :e; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedPrimarySource: _NS$e("qualifiedPrimarySource"),
      /**
       * The _optional_ Usage involved in an Entity's Derivation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      hadUsage: _NS$e("hadUsage"),
      /**
       * invalidated
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      invalidated: _NS$e("invalidated"),
      /**
       * The position that this OWL term should be listed within documentation. The scope of the documentation (e.g., among all terms, among terms within a prov:category, among properties applying to a particular class, etc.) is unspecified.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      order: _NS$e("order"),
      /**
       * If this Activity prov:wasAssociatedWith Agent :ag, then it can qualify the Association using prov:qualifiedAssociation [ a prov:Association;  prov:agent :ag; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedAssociation: _NS$e("qualifiedAssociation"),
      /**
       * Because prov:qualifiedInfluence is a broad relation, the more specific relations (qualifiedCommunication, qualifiedDelegation, qualifiedEnd, etc.) should be used when applicable.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedInfluence: _NS$e("qualifiedInfluence"),
      /**
       * If this Entity prov:wasAttributedTo Agent :ag, then it can qualify how it was influenced using prov:qualifiedAttribution [ a prov:Attribution;  prov:agent :ag; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedAttribution: _NS$e("qualifiedAttribution"),
      /**
       * If this Activity prov:wasInformedBy Activity :a, then it can qualify how it was influenced using prov:qualifiedCommunication [ a prov:Communication;  prov:activity :a; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedCommunication: _NS$e("qualifiedCommunication"),
      /**
       * If this Entity prov:wasDerivedFrom Entity :e, then it can qualify how it was derived using prov:qualifiedDerivation [ a prov:Derivation;  prov:entity :e; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedDerivation: _NS$e("qualifiedDerivation"),
      /**
       * If this Activity prov:wasEndedBy Entity :e1, then it can qualify how it was ended using prov:qualifiedEnd [ a prov:End;  prov:entity :e1; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedEnd: _NS$e("qualifiedEnd"),
      /**
       * If this Activity prov:generated Entity :e, then it can qualify how it performed the Generation using prov:qualifiedGeneration [ a prov:Generation;  prov:entity :e; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedGeneration: _NS$e("qualifiedGeneration"),
      /**
       * If this Entity prov:wasInvalidatedBy Activity :a, then it can qualify how it was invalidated using prov:qualifiedInvalidation [ a prov:Invalidation;  prov:activity :a; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedInvalidation: _NS$e("qualifiedInvalidation"),
      /**
       * If this Entity prov:wasQuotedFrom Entity :e, then it can qualify how using prov:qualifiedQuotation [ a prov:Quotation;  prov:entity :e; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedQuotation: _NS$e("qualifiedQuotation"),
      /**
       * If this Entity prov:wasRevisionOf Entity :e, then it can qualify how it was revised using prov:qualifiedRevision [ a prov:Revision;  prov:entity :e; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedRevision: _NS$e("qualifiedRevision"),
      /**
       * If this Activity prov:wasStartedBy Entity :e1, then it can qualify how it was started using prov:qualifiedStart [ a prov:Start;  prov:entity :e1; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedStart: _NS$e("qualifiedStart"),
      /**
       * If this Activity prov:used Entity :e, then it can qualify how it used it using prov:qualifiedUsage [ a prov:Usage; prov:entity :e; :foo :bar ].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      qualifiedUsage: _NS$e("qualifiedUsage"),
      /**
       *
       */
      todo: _NS$e("todo"),
      /**
       * value
       *
       * Defined by the vocabulary: http://www.w3.org/ns/prov-o#
       */
      value: _NS$e("value"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$d = new rdfDataFactory.DataFactory();
  function _NS$d(localName) {
      return rdfFactory$d.namedNode("http://www.w3.org/ns/dx/conneg/altr#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * This ontology allows for the description of representations of Internet resources.

  Representations may conform to prof:Profile instances and may have the format of a particular dct:MediaType.
   */
  var ALTR = {
      PREFIX: "altr",
      NAMESPACE: "http://www.w3.org/ns/dx/conneg/altr#",
      PREFIX_AND_NAMESPACE: { "altr": "http://www.w3.org/ns/dx/conneg/altr#" },
      NS: _NS$d,
      // *****************
      // All the Classes.
      // *****************
      /**
       * An abstraction of the current or desired state of a thing in HTTP communications.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/dx/connegp/altp
       */
      Representation: _NS$d("Representation"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Indicates a Representation of a Resource.
       */
      hasRepresentation: _NS$d("hasRepresentation"),
      /**
       * Indicates the default Representation of a Resource.
       */
      hasDefaultRepresentation: _NS$d("hasDefaultRepresentation"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$c = new rdfDataFactory.DataFactory();
  function _NS$c(localName) {
      return rdfFactory$c.namedNode("http://www.w3.org/ns/hydra/core#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * The Hydra Core Vocabulary is a lightweight vocabulary to create hypermedia-driven Web APIs. By specifying a number of concepts commonly used in Web APIs it enables the creation of generic API clients.
   */
  var HYDRA = {
      PREFIX: "hydra",
      NAMESPACE: "http://www.w3.org/ns/hydra/core#",
      PREFIX_AND_NAMESPACE: { "hydra": "http://www.w3.org/ns/hydra/core#" },
      NS: _NS$c,
      // *****************
      // All the Classes.
      // *****************
      /**
       * The class of Hydra classes.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      Class: _NS$c("Class"),
      /**
       * The class of properties representing links.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      Link: _NS$c("Link"),
      /**
       * The Hydra API documentation class
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      ApiDocumentation: _NS$c("ApiDocumentation"),
      /**
       * A templated link.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      TemplatedLink: _NS$c("TemplatedLink"),
      /**
       * A runtime error, used to report information beyond the returned status code.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      Error: _NS$c("Error"),
      /**
       * A collection holding references to a number of related resources.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      Collection: _NS$c("Collection"),
      /**
       * A PartialCollectionView describes a partial view of a Collection. Multiple PartialCollectionViews can be connected with the the next/previous properties to allow a client to retrieve all members of the collection.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      PartialCollectionView: _NS$c("PartialCollectionView"),
      /**
       * Provides a base abstract for base Uri source for Iri template resolution.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      BaseUriSource: _NS$c("BaseUriSource"),
      /**
       * Specifies a possible either expected or returned header values
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      HeaderSpecification: _NS$c("HeaderSpecification"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * A property
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      property: _NS$c("property"),
      /**
       * True if the property is required, false otherwise.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      required: _NS$c("required"),
      /**
       * True if the client can retrieve the property's value, false otherwise.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      readable: _NS$c("readable"),
      /**
       * True if the client can change the property's value, false otherwise.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      writable: _NS$c("writable"),
      /**
       * This property is left for compatibility purposes and hydra:writable should be used instead.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      writeable: _NS$c("writeable"),
      /**
       * The HTTP method.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      method: _NS$c("method"),
      /**
       * The HTTP status code. Please note it may happen this value will be different to actual status code received.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      statusCode: _NS$c("statusCode"),
      /**
       * A title, often used along with a description.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      title: _NS$c("title"),
      /**
       * A description.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      description: _NS$c("description"),
      /**
       * This predicate is left for compatibility purposes and hydra:memberAssertion should be used instead.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      manages: _NS$c("manages"),
      /**
       * The total number of items referenced by a collection.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      totalItems: _NS$c("totalItems"),
      /**
       * A property representing a freetext query.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      freetextQuery: _NS$c("freetextQuery"),
      /**
       * A templated string with placeholders. The literal's datatype indicates the template syntax; if not specified, hydra:Rfc6570Template is assumed.
       *
       * See also:
       *  - http://www.w3.org/ns/hydra/core#Rfc6570Template
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      template: _NS$c("template"),
      /**
       * An IRI template as defined by RFC6570.
       *
       * See also:
       *  - http://tools.ietf.org/html/rfc6570
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      Rfc6570Template: _NS$c("Rfc6570Template"),
      /**
       * The representation format to use when expanding the IRI template.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      variableRepresentation: _NS$c("variableRepresentation"),
      /**
       * A variable-to-property mapping of the IRI template.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      mapping: _NS$c("mapping"),
      /**
       * An IRI template variable
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      variable: _NS$c("variable"),
      /**
       * relative Uri resolution
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      resolveRelativeUsing: _NS$c("resolveRelativeUsing"),
      /**
       * Instructs to skip N elements of the set.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      offset: _NS$c("offset"),
      /**
       * Instructs to limit set only to N elements.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      limit: _NS$c("limit"),
      /**
       * Instructs to provide a specific page of the collection at a given index.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      pageIndex: _NS$c("pageIndex"),
      /**
       * Instructs to provide a specific page reference of the collection.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      pageReference: _NS$c("pageReference"),
      /**
       * Name of the header returned by the operation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      returnsHeader: _NS$c("returnsHeader"),
      /**
       * Specification of the header expected by the operation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      expectsHeader: _NS$c("expectsHeader"),
      /**
       * Name of the header.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      headerName: _NS$c("headerName"),
      /**
       * Possible value of the header.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      possibleValue: _NS$c("possibleValue"),
      /**
       * Determines whether the provided set of header values is closed or not.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      closedSet: _NS$c("closedSet"),
      /**
       * Hint on what kind of extensions are in use.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/hydra/core
       */
      extension: _NS$c("extension"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$b = new rdfDataFactory.DataFactory();
  function _NS$b(localName) {
      return rdfFactory$b.namedNode("http://www.w3.org/ns/dcat#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * DCAT es un vocabulario RDF diseñado para facilitar la interoperabilidad entre catálogos de datos publicados en la Web. Utilizando DCAT para describir datos disponibles en catálogos se aumenta la posibilidad de que sean descubiertos y se permite que las aplicaciones consuman fácilmente los metadatos de varios catálogos.
   */
  var DCAT = {
      PREFIX: "dcat",
      NAMESPACE: "http://www.w3.org/ns/dcat#",
      PREFIX_AND_NAMESPACE: { "dcat": "http://www.w3.org/ns/dcat#" },
      NS: _NS$b,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A curated collection of metadata about resources (e.g., datasets and data services in the context of a data catalog).
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      Catalog: _NS$b("Catalog"),
      /**
       * A collection of data, published or curated by a single source, and available for access or download in one or more representations.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      Dataset: _NS$b("Dataset"),
      /**
       * Resource published or curated by a single agent.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      Resource: _NS$b("Resource"),
      /**
       * A record in a data catalog, describing the registration of a single dataset or data service.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [8] labels in languages [ar, cs, da, el, es, fr, it, ja], but [7] comments in languages [cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      CatalogRecord: _NS$b("CatalogRecord"),
      /**
       * A site or end-point providing operations related to the discovery of, access to, or processing functions on, data or related resources.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [3] labels in languages [da, es, it], but [4] comments in languages [cs, da, es, it].
       */
      DataService: _NS$b("DataService"),
      /**
       * A specific representation of a dataset. A dataset might be available in multiple serializations that may differ in various ways, including natural language, media-type or format, schematic organization, temporal and spatial resolution, level of detail or profiles (which might specify any or all of the above).
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      Distribution: _NS$b("Distribution"),
      /**
       * An association class for attaching additional information to a relationship between DCAT Resources.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      Relationship: _NS$b("Relationship"),
      /**
       * A role is the function of a resource or agent with respect to another resource, in the context of resource attribution or resource relationships.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       *
       * See also:
       *  - http://www.w3.org/ns/dcat#hadRole
       */
      Role: _NS$b("Role"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The root location or primary endpoint of the service (a web-resolvable IRI).
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      endpointURL: _NS$b("endpointURL"),
      /**
       * The function of an entity or agent with respect to another entity or resource.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [3] labels in languages [cs, da, it], but [4] comments in languages [cs, da, es, it].
       */
      hadRole: _NS$b("hadRole"),
      /**
       * A site or end-point that gives access to the distribution of the dataset.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      accessService: _NS$b("accessService"),
      /**
       * A URL of a resource that gives access to a distribution of the dataset. E.g. landing page, feed, SPARQL endpoint. Use for all cases except a simple download link, in which case downloadURL is preferred.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      accessURL: _NS$b("accessURL"),
      /**
       * The geographic bounding box of a resource.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [4] labels in languages [cs, da, es, it], but [0] comments.
       */
      bbox: _NS$b("bbox"),
      /**
       * The size of a distribution in bytes.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      byteSize: _NS$b("byteSize"),
      /**
       * A catalog whose contents are of interest in the context of this catalog.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      catalog: _NS$b("catalog"),
      /**
       * The geographic center (centroid) of a resource.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [4] labels in languages [cs, da, es, it], but [0] comments.
       */
      centroid: _NS$b("centroid"),
      /**
       * The compression format of the distribution in which the data is contained in a compressed form, e.g. to reduce the size of the downloadable file.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       *
       * Defined by the vocabulary: https://www.w3.org/TR/vocab-dcat-2/
       */
      compressFormat: _NS$b("compressFormat"),
      /**
       * Relevant contact information for the catalogued resource. Use of vCard is recommended.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      contactPoint: _NS$b("contactPoint"),
      /**
       * A collection of data that is listed in the catalog.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      dataset: _NS$b("dataset"),
      /**
       * An available distribution of the dataset.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      distribution: _NS$b("distribution"),
      /**
       * The URL of the downloadable file in a given format. E.g. CSV file or RDF file. The format is indicated by the distribution's dct:format and/or dcat:mediaType.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      downloadURL: _NS$b("downloadURL"),
      /**
       * The end of the period.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [4] labels in languages [cs, da, es, it], but [0] comments.
       */
      endDate: _NS$b("endDate"),
      /**
       * A description of the service end-point, including its operations, parameters etc.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      endpointDescription: _NS$b("endpointDescription"),
      /**
       * A keyword or tag describing a resource.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      keyword: _NS$b("keyword"),
      /**
       * A Web page that can be navigated to in a Web browser to gain access to the catalog, a dataset, its distributions and/or additional information.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      landingPage: _NS$b("landingPage"),
      /**
       * The media type of the distribution as defined by IANA
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      mediaType: _NS$b("mediaType"),
      /**
       * The package format of the distribution in which one or more data files are grouped together, e.g. to enable a set of related files to be downloaded together.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       *
       * Defined by the vocabulary: https://www.w3.org/TR/vocab-dcat-2/
       */
      packageFormat: _NS$b("packageFormat"),
      /**
       * Link to a description of a relationship with another resource.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      qualifiedRelation: _NS$b("qualifiedRelation"),
      /**
       * A record describing the registration of a single dataset or data service that is part of the catalog.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      record: _NS$b("record"),
      /**
       * A collection of data that this DataService can distribute.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      servesDataset: _NS$b("servesDataset"),
      /**
       * A site or endpoint that is listed in the catalog.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      service: _NS$b("service"),
      /**
       * minimum spatial separation resolvable in a dataset, measured in meters.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      spatialResolutionInMeters: _NS$b("spatialResolutionInMeters"),
      /**
       * The start of the period
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [3] labels in languages [cs, da, it], but [0] comments.
       */
      startDate: _NS$b("startDate"),
      /**
       * minimum time period resolvable in a dataset.
       *
       * This term has [4] labels and comments, in the languages [cs, da, es, it].
       */
      temporalResolution: _NS$b("temporalResolution"),
      /**
       * A main category of the resource. A resource can have multiple themes.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      theme: _NS$b("theme"),
      /**
       * The knowledge organization system (KOS) used to classify catalog's datasets.
       *
       * This term has [8] labels and comments, in the languages [ar, cs, da, el, es, fr, it, ja].
       *
       * Defined by the vocabulary: http://www.w3.org/TR/vocab-dcat/
       */
      themeTaxonomy: _NS$b("themeTaxonomy"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$a = new rdfDataFactory.DataFactory();
  function _NS$a(localName) {
      return rdfFactory$a.namedNode("http://www.w3.org/2002/01/bookmark#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - W3C Bookmark vocabulary
   */
  var BOOKMARK = {
      PREFIX: "bookmark",
      NAMESPACE: "http://www.w3.org/2002/01/bookmark#",
      PREFIX_AND_NAMESPACE: { "bookmark": "http://www.w3.org/2002/01/bookmark#" },
      NS: _NS$a,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Topic
       */
      Topic: _NS$a("Topic"),
      /**
       * Specifies a behavior; when the
                    object of type 'Shortcut' is activated, the
                    client follows the 'recalls' property and
                    activates the object at the end of that
                    'recalls' property.  The target object may
                    be another Bookmark or may be a Topic.
       */
      Shortcut: _NS$a("Shortcut"),
      /**
       * The class to which all bookmarks belong.
       */
      Bookmark: _NS$a("Bookmark"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * relates a bookmark to a topic.
                    A bookmark must have at least one hasTopic property.
                    The typical user operation of following a bookmark link
                    will use the value of the b:recalls property. This property
                    corresponds to XBEL:href property.
       */
      hasTopic: _NS$a("hasTopic"),
      /**
       * connects a Shortcut to the bookmark or topic that is
    being included by reference in some other topic
       */
      leadsTo: _NS$a("leadsTo"),
      /**
       * This corresponds to XBEL:href an
                    object of type Bookmark is expected to have a
                    'recalls' relationship to the document being
                    bookmarked.  The 'bookmarks' property is an older
                    name for the 'recalls' relationship.
       */
      bookmarks: _NS$a("bookmarks"),
      /**
       * Relates a bookmark with the resource that
                    has been bookmarked.  This corresponds to XBEL:href;
                    an object of type Bookmark is expected to have a
                    'recalls' relationship to the document being
                    bookmarked
       */
      recalls: _NS$a("recalls"),
      /**
       * Describes a relationship between Topics.
            When a topic T is a sub-topic of a topic U then all
            bookmarks that have topic T are also considered to have
            topic U. A topic may be a sub-topic of one or more
            topics; trivially, every topic is a sub-topic of itself.
            More formally; for all B, T, and U: b b:hasTopic T,
            T b:subTopicOf U implies B b:hasTopic U.
       */
      subTopicOf: _NS$a("subTopicOf"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$9 = new rdfDataFactory.DataFactory();
  function _NS$9(localName) {
      return rdfFactory$9.namedNode("http://www.w3.org/ns/sparql-service-description#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - SPARQL Service Description vocabulary
   */
  var SD = {
      PREFIX: "sd",
      NAMESPACE: "http://www.w3.org/ns/sparql-service-description#",
      PREFIX_AND_NAMESPACE: { "sd": "http://www.w3.org/ns/sparql-service-description#" },
      NS: _NS$9,
      // *****************
      // All the Classes.
      // *****************
      /**
       * An instance of sd:Service represents a SPARQL service made available via the SPARQL Protocol.
       */
      Service: _NS$9("Service"),
      /**
       * An instance of sd:Feature represents a feature of a SPARQL service. Specific types of features include functions, aggregates, languages, and entailment regimes and profiles. This document defines five instances of sd:Feature: sd:DereferencesURIs, sd:UnionDefaultGraph, sd:RequiresDataset, sd:EmptyGraphs, and sd:BasicFederatedQuery.
       */
      Feature: _NS$9("Feature"),
      /**
       * An instance of sd:EntailmentRegime represents an entailment regime used in basic graph pattern matching (as described by SPARQL 1.1 Query Language).
       */
      EntailmentRegime: _NS$9("EntailmentRegime"),
      /**
       * An instance of sd:NamedGraph represents a named graph having a name (via sd:name) and an optional graph description (via sd:graph).
       */
      NamedGraph: _NS$9("NamedGraph"),
      /**
       * An instance of sd:EntailmentProfile represents a profile of an entailment regime. An entailment profile MAY impose restrictions on what constitutes valid RDF with respect to entailment.
       */
      EntailmentProfile: _NS$9("EntailmentProfile"),
      /**
       * An instance of sd:Function represents a function that may be used in a SPARQL SELECT expression or a FILTER, HAVING, GROUP BY, ORDER BY, or BIND clause.
       */
      Function: _NS$9("Function"),
      /**
       * An instance of sd:Aggregate represents an aggregate that may be used in a SPARQL aggregate query (for instance in a HAVING clause or SELECT expression) besides the standard list of supported aggregates COUNT, SUM, MIN, MAX, AVG, GROUP_CONCAT, and SAMPLE.
       */
      Aggregate: _NS$9("Aggregate"),
      /**
       * An instance of sd:Language represents one of the SPARQL languages, including specific configurations providing particular features or extensions. This document defines three instances of sd:Language: sd:SPARQL10Query, sd:SPARQL11Query, and sd:SPARQL11Update.
       */
      Language: _NS$9("Language"),
      /**
       * An instance of sd:Dataset represents a RDF Dataset comprised of a default graph and zero or more named graphs.
       */
      Dataset: _NS$9("Dataset"),
      /**
       * An instance of sd:GraphCollection represents a collection of zero or more named graph descriptions. Each named graph description belonging to an sd:GraphCollection MUST be linked with the sd:namedGraph predicate.
       */
      GraphCollection: _NS$9("GraphCollection"),
      /**
       * An instance of sd:Graph represents the description of an RDF graph.
       */
      Graph: _NS$9("Graph"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The SPARQL endpoint of an sd:Service that implements the SPARQL Protocol service. The object of the sd:endpoint property is an IRI.
       */
      endpoint: _NS$9("endpoint"),
      /**
       * Relates an instance of sd:Service with a resource representing a supported feature.
       */
      feature: _NS$9("feature"),
      /**
       * Relates an instance of sd:Service with a resource representing an entailment regime used for basic graph pattern matching. This property is intended for use when a single entailment regime by default applies to all graphs in the default dataset of the service. In situations where a different entailment regime applies to a specific graph in the dataset, the sd:entailmentRegime property should be used to indicate this fact in the description of that graph.
       */
      defaultEntailmentRegime: _NS$9("defaultEntailmentRegime"),
      /**
       * Relates a named graph description with a resource representing an entailment regime used for basic graph pattern matching over that graph.
       */
      entailmentRegime: _NS$9("entailmentRegime"),
      /**
       * Relates an instance of sd:Service with a resource representing a supported profile of the default entailment regime (as declared by sd:defaultEntailmentRegime).
       */
      defaultSupportedEntailmentProfile: _NS$9("defaultSupportedEntailmentProfile"),
      /**
       * Relates a named graph description with a resource representing a supported profile of the entailment regime (as declared by sd:entailmentRegime) used for basic graph pattern matching over that graph.
       */
      supportedEntailmentProfile: _NS$9("supportedEntailmentProfile"),
      /**
       * Relates an instance of sd:Service to a function that may be used in a SPARQL SELECT expression or a FILTER, HAVING, GROUP BY, ORDER BY, or BIND clause.
       */
      extensionFunction: _NS$9("extensionFunction"),
      /**
       * Relates an instance of sd:Service to an aggregate that may be used in a SPARQL aggregate query (for instance in a HAVING clause or SELECT expression) besides the standard list of supported aggregates COUNT, SUM, MIN, MAX, AVG, GROUP_CONCAT, and SAMPLE
       */
      extensionAggregate: _NS$9("extensionAggregate"),
      /**
       * Relates an instance of sd:Service to a resource representing an implemented extension to the SPARQL Query or Update language.
       */
      languageExtension: _NS$9("languageExtension"),
      /**
       * Relates an instance of sd:Service to a SPARQL language (e.g. Query and Update) that it implements.
       */
      supportedLanguage: _NS$9("supportedLanguage"),
      /**
       * Relates an instance of sd:Service to a resource representing an implemented feature that extends the SPARQL Query or Update language and that is accessed by using the named property.
       */
      propertyFeature: _NS$9("propertyFeature"),
      /**
       * Relates an instance of sd:Service to a description of the default dataset available when no explicit dataset is specified in the query, update request or via protocol parameters.
       */
      defaultDataset: _NS$9("defaultDataset"),
      /**
       * Relates an instance of sd:Service to a description of the graphs which are allowed in the construction of a dataset either via the SPARQL Protocol, with FROM/FROM NAMED clauses in a query, or with USING/USING NAMED in an update request, if the service limits the scope of dataset construction.
       */
      availableGraphs: _NS$9("availableGraphs"),
      /**
       * Relates an instance of sd:Service to a format that is supported for serializing query results.
       */
      resultFormat: _NS$9("resultFormat"),
      /**
       * Relates an instance of sd:Service to a format that is supported for parsing RDF input; for example, via a SPARQL 1.1 Update LOAD statement, or when URIs are dereferenced in FROM/FROM NAMED/USING/USING NAMED clauses.
       */
      inputFormat: _NS$9("inputFormat"),
      /**
       * Relates an instance of sd:Dataset to the description of its default graph.
       */
      defaultGraph: _NS$9("defaultGraph"),
      /**
       * Relates an instance of sd:GraphCollection (or its subclass sd:Dataset) to the description of one of its named graphs. The description of such a named graph MUST include the sd:name property and MAY include the sd:graph property.
       */
      namedGraph: _NS$9("namedGraph"),
      /**
       * Relates a named graph to the name by which it may be referenced in a FROM/FROM NAMED clause. The object of the sd:name property is an IRI.
       */
      name: _NS$9("name"),
      /**
       * Relates a named graph to its graph description.
       */
      graph: _NS$9("graph"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$8 = new rdfDataFactory.DataFactory();
  function _NS$8(localName) {
      return rdfFactory$8.namedNode("http://rdfs.org/ns/void#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * The Vocabulary of Interlinked Datasets (VoID) is an RDF Schema vocabulary for expressing metadata about RDF datasets. It is intended as a bridge between the publishers and users of RDF data, with applications ranging from data discovery to cataloging and archiving of datasets. This document provides a formal definition of the new RDF classes and properties introduced for VoID. It is a companion to the main specification document for VoID, <em><a href="http://www.w3.org/TR/void/">Describing Linked Datasets with the VoID Vocabulary</a></em>.
   */
  var VOID = {
      PREFIX: "void",
      NAMESPACE: "http://rdfs.org/ns/void#",
      PREFIX_AND_NAMESPACE: { "void": "http://rdfs.org/ns/void#" },
      NS: _NS$8,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A set of RDF triples that are published, maintained or aggregated by a single provider.
       */
      Dataset: _NS$8("Dataset"),
      /**
       * A collection of RDF links between two void:Datasets.
       */
      Linkset: _NS$8("Linkset"),
      /**
       * A technical feature of a void:Dataset, such as a supported RDF serialization format.
       */
      TechnicalFeature: _NS$8("TechnicalFeature"),
      /**
       * A web resource whose foaf:primaryTopic or foaf:topics include void:Datasets.
       */
      DatasetDescription: _NS$8("DatasetDescription"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * feature
       */
      feature: _NS$8("feature"),
      /**
       * has subset
       */
      subset: _NS$8("subset"),
      /**
       * One of the two datasets linked by the Linkset.
       */
      target: _NS$8("target"),
      /**
       * has a SPARQL endpoint at
       */
      sparqlEndpoint: _NS$8("sparqlEndpoint"),
      /**
       * a link predicate
       */
      linkPredicate: _NS$8("linkPredicate"),
      /**
       * example resource of dataset
       */
      exampleResource: _NS$8("exampleResource"),
      /**
       * A vocabulary that is used in the dataset.
       */
      vocabulary: _NS$8("vocabulary"),
      /**
       * The dataset describing the subjects of triples contained in the Linkset.
       */
      subjectsTarget: _NS$8("subjectsTarget"),
      /**
       * The dataset describing the objects of the triples contained in the Linkset.
       */
      objectsTarget: _NS$8("objectsTarget"),
      /**
       * An RDF dump, partial or complete, of a void:Dataset.
       */
      dataDump: _NS$8("dataDump"),
      /**
       * Defines a simple URI look-up protocol for accessing a dataset.
       */
      uriLookupEndpoint: _NS$8("uriLookupEndpoint"),
      /**
       * Defines a regular expression pattern matching URIs in the dataset.
       */
      uriRegexPattern: _NS$8("uriRegexPattern"),
      /**
       * The rdfs:Class that is the rdf:type of all entities in a class-based partition.
       */
      class: _NS$8("class"),
      /**
       * The total number of distinct classes in a void:Dataset. In other words, the number of distinct resources occuring as objects of rdf:type triples in the dataset.
       */
      classes: _NS$8("classes"),
      /**
       * A subset of a void:Dataset that contains only the entities of a certain rdfs:Class.
       */
      classPartition: _NS$8("classPartition"),
      /**
       * The total number of distinct objects in a void:Dataset. In other words, the number of distinct resources that occur in the object position of triples in the dataset. Literals are included in this count.
       */
      distinctObjects: _NS$8("distinctObjects"),
      /**
       * The total number of distinct subjects in a void:Dataset. In other words, the number of distinct resources that occur in the subject position of triples in the dataset.
       */
      distinctSubjects: _NS$8("distinctSubjects"),
      /**
       * The total number of documents, for datasets that are published as a set of individual documents, such as RDF/XML documents or RDFa-annotated web pages. Non-RDF documents, such as web pages in HTML or images, are usually not included in this count. This property is intended for datasets where the total number of triples or entities is hard to determine. void:triples or void:entities should be preferred where practical.
       */
      documents: _NS$8("documents"),
      /**
       * The total number of entities that are described in a void:Dataset.
       */
      entities: _NS$8("entities"),
      /**
       * Points to the void:Dataset that a document is a part of.
       */
      inDataset: _NS$8("inDataset"),
      /**
       * An OpenSearch description document for a free-text search service over a void:Dataset.
       */
      openSearchDescription: _NS$8("openSearchDescription"),
      /**
       * The total number of distinct properties in a void:Dataset. In other words, the number of distinct resources that occur in the predicate position of triples in the dataset.
       */
      properties: _NS$8("properties"),
      /**
       * The rdf:Property that is the predicate of all triples in a property-based partition.
       */
      property: _NS$8("property"),
      /**
       * A subset of a void:Dataset that contains only the triples of a certain rdf:Property.
       */
      propertyPartition: _NS$8("propertyPartition"),
      /**
       * A top concept or entry point for a void:Dataset that is structured in a tree-like fashion. All resources in a dataset can be reached by following links from its root resources in a small number of steps.
       */
      rootResource: _NS$8("rootResource"),
      /**
       * The total number of triples contained in a void:Dataset.
       */
      triples: _NS$8("triples"),
      /**
       * A URI that is a common string prefix of all the entity URIs in a void:Dataset.
       */
      uriSpace: _NS$8("uriSpace"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$7 = new rdfDataFactory.DataFactory();
  function _NS$7(localName) {
      return rdfFactory$7.namedNode("http://www.w3.org/2006/time#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Time Ontology in OWL
   */
  var TIME = {
      PREFIX: "time",
      NAMESPACE: "http://www.w3.org/2006/time#",
      PREFIX_AND_NAMESPACE: { "time": "http://www.w3.org/2006/time#" },
      NS: _NS$7,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Description of date and time structured with separate values for the various elements of a calendar-clock system. The temporal reference system is fixed to Gregorian Calendar, and the range of year, month, day properties restricted to corresponding XML Schema types xsd:gYear, xsd:gMonth and xsd:gDay, respectively.
       *
       * This term has [1] label and comment, in the language [es].
       */
      DateTimeDescription: _NS$7("DateTimeDescription"),
      /**
       * Description of date and time structured with separate values for the various elements of a calendar-clock system
       *
       * This term has [1] label and comment, in the language [es].
       */
      GeneralDateTimeDescription: _NS$7("GeneralDateTimeDescription"),
      /**
       * DateTimeInterval is a subclass of ProperInterval, defined using the multi-element DateTimeDescription.
       *
       * This term has [1] label and comment, in the language [es].
       */
      DateTimeInterval: _NS$7("DateTimeInterval"),
      /**
       * A temporal entity with non-zero extent or duration, i.e. for which the value of the beginning and end are different
       *
       * This term has [1] label and comment, in the language [es].
       */
      ProperInterval: _NS$7("ProperInterval"),
      /**
       * The day of week
       *
       * This term has [1] label and comment, in the language [es].
       */
      DayOfWeek: _NS$7("DayOfWeek"),
      /**
       * Duration of a temporal extent expressed as a number scaled by a temporal unit
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [0] labels, but [1] comment in the language [es].
       */
      Duration: _NS$7("Duration"),
      /**
       * Time extent; duration of a time interval separate from its particular start position
       *
       * This term has [1] label and comment, in the language [es].
       */
      TemporalDuration: _NS$7("TemporalDuration"),
      /**
       * Description of temporal extent structured with separate values for the various elements of a calendar-clock system. The temporal reference system is fixed to Gregorian Calendar, and the range of each of the numeric properties is restricted to xsd:decimal
       *
       * This term has [1] label and comment, in the language [es].
       */
      DurationDescription: _NS$7("DurationDescription"),
      /**
       * Description of temporal extent structured with separate values for the various elements of a calendar-clock system.
       *
       * This term has [1] label and comment, in the language [es].
       */
      GeneralDurationDescription: _NS$7("GeneralDurationDescription"),
      /**
       * A position on a time-line
       *
       * This term has [1] label and comment, in the language [es].
       */
      TemporalPosition: _NS$7("TemporalPosition"),
      /**
       * A temporal entity with zero extent or duration
       *
       * This term has [1] label and comment, in the language [es].
       */
      Instant: _NS$7("Instant"),
      /**
       * A temporal interval or instant.
       *
       * This term has [1] label and comment, in the language [es].
       */
      TemporalEntity: _NS$7("TemporalEntity"),
      /**
       * A temporal entity with an extent or duration
       *
       * This term has [1] label and comment, in the language [es].
       */
      Interval: _NS$7("Interval"),
      /**
       * January
       */
      January: _NS$7("January"),
      /**
       * The month of the year
       *
       * This term has [1] label and comment, in the language [es].
       */
      MonthOfYear: _NS$7("MonthOfYear"),
      /**
       * A temporal reference system, such as a temporal coordinate system (with an origin, direction, and scale), a calendar-clock combination, or a (possibly hierarchical) ordinal system.
    
    This is a stub class, representing the set of all temporal reference systems.
       *
       * This term has [1] label and comment, in the language [es].
       */
      TRS: _NS$7("TRS"),
      /**
       * A standard duration, which provides a scale factor for a time extent, or the granularity or precision for a time position.
       *
       * This term has [1] label and comment, in the language [es].
       */
      TemporalUnit: _NS$7("TemporalUnit"),
      /**
       * A temporal position described using either a (nominal) value from an ordinal reference system, or a (numeric) value in a temporal coordinate system.
       *
       * This term has [1] label and comment, in the language [es].
       */
      TimePosition: _NS$7("TimePosition"),
      /**
       * A Time Zone specifies the amount by which the local time is offset from UTC.
        A time zone is usually denoted geographically (e.g. Australian Eastern Daylight Time), with a constant value in a given region.
    The region where it applies and the offset from UTC are specified by a locally recognised governing authority.
       *
       * This term has [1] label and comment, in the language [es].
       */
      TimeZone: _NS$7("TimeZone"),
      /**
       * Year duration
       */
      Year: _NS$7("Year"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * Day position in a calendar-clock system.
    
    The range of this property is not specified, so can be replaced by any specific representation of a calendar day from any calendar.
       *
       * This term has [1] label and comment, in the language [es].
       */
      day: _NS$7("day"),
      /**
       * Month position in a calendar-clock system.
    
    The range of this property is not specified, so can be replaced by any specific representation of a calendar month from any calendar.
       *
       * This term has [1] label and comment, in the language [es].
       */
      month: _NS$7("month"),
      /**
       * Year position in a calendar-clock system.
    
    The range of this property is not specified, so can be replaced by any specific representation of a calendar year from any calendar.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [0] labels, but [1] comment in the language [es].
       */
      year: _NS$7("year"),
      /**
       * The temporal reference system used by a temporal position or extent description.
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasTRS: _NS$7("hasTRS"),
      /**
       * Value of a temporal extent expressed as a decimal number scaled by a temporal unit
       *
       * This term has [1] label and comment, in the language [es].
       */
      numericDuration: _NS$7("numericDuration"),
      /**
       * The temporal unit which provides the precision of a date-time value or scale of a temporal extent
       *
       * This term has [1] label and comment, in the language [es].
       */
      unitType: _NS$7("unitType"),
      /**
       * length of, or element of the length of, a temporal extent expressed in days
       *
       * This term has [1] label and comment, in the language [es].
       */
      days: _NS$7("days"),
      /**
       * length of, or element of the length of, a temporal extent expressed in hours
       *
       * This term has [1] label and comment, in the language [es].
       */
      hours: _NS$7("hours"),
      /**
       * length, or element of, a temporal extent expressed in minutes
       *
       * This term has [1] label and comment, in the language [es].
       */
      minutes: _NS$7("minutes"),
      /**
       * length of, or element of the length of, a temporal extent expressed in months
       *
       * This term has [1] label and comment, in the language [es].
       */
      months: _NS$7("months"),
      /**
       * length of, or element of the length of, a temporal extent expressed in seconds
       *
       * This term has [1] label and comment, in the language [es].
       *
       * See also:
       *  - http://www.bipm.org/en/publications/si-brochure/second.html
       */
      seconds: _NS$7("seconds"),
      /**
       * length of, or element of the length of, a temporal extent expressed in weeks
       *
       * This term has [1] label and comment, in the language [es].
       */
      weeks: _NS$7("weeks"),
      /**
       * length of, or element of the length of, a temporal extent expressed in years
       *
       * This term has [1] label and comment, in the language [es].
       */
      years: _NS$7("years"),
      /**
       * The day of week, whose value is a member of the class time:DayOfWeek
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       */
      dayOfWeek: _NS$7("dayOfWeek"),
      /**
       * The number of the day within the year
       *
       * This term has [1] label and comment, in the language [es].
       */
      dayOfYear: _NS$7("dayOfYear"),
      /**
       * Hour position in a calendar-clock system.
       *
       * This term has [1] label and comment, in the language [es].
       */
      hour: _NS$7("hour"),
      /**
       * Minute position in a calendar-clock system.
       *
       * This term has [1] label and comment, in the language [es].
       */
      minute: _NS$7("minute"),
      /**
       * The month of the year, whose value is a member of the class time:MonthOfYear
       *
       * This term has [1] label and comment, in the language [es].
       */
      monthOfYear: _NS$7("monthOfYear"),
      /**
       * Second position in a calendar-clock system.
       *
       * This term has [1] label and comment, in the language [es].
       */
      second: _NS$7("second"),
      /**
       * The time zone for clock elements in the temporal position
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       */
      timeZone: _NS$7("timeZone"),
      /**
       * Week number within the year.
       *
       * This term has [1] label and comment, in the language [es].
       */
      week: _NS$7("week"),
      /**
       * The (numeric) value indicating position within a temporal coordinate system
       *
       * This term has [1] label and comment, in the language [es].
       */
      numericPosition: _NS$7("numericPosition"),
      /**
       * The (nominal) value indicating temporal position in an ordinal reference system
       *
       * This term has [1] label and comment, in the language [es].
       */
      nominalPosition: _NS$7("nominalPosition"),
      /**
       * Gives directionality to time. If a temporal entity T1 is after another temporal entity T2, then the beginning of T1 is after the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      after: _NS$7("after"),
      /**
       * Gives directionality to time. If a temporal entity T1 is before another temporal entity T2, then the end of T1 is before the beginning of T2. Thus, "before" can be considered to be basic to instants and derived for intervals.
       *
       * This term has [1] label and comment, in the language [es].
       */
      before: _NS$7("before"),
      /**
       * Day of month - formulated as a text string with a pattern constraint to reproduce the same lexical form as gDay, except that values up to 99 are permitted, in order to support calendars with more than 31 days in a month.
    Note that the value-space is not defined, so a generic OWL2 processor cannot compute ordering relationships of values of this type.
       *
       * This term has [1] label and comment, in the language [es].
       */
      generalDay: _NS$7("generalDay"),
      /**
       * Month of year - formulated as a text string with a pattern constraint to reproduce the same lexical form as gMonth, except that values up to 20 are permitted, in order to support calendars with more than 12 months in the year.
    Note that the value-space is not defined, so a generic OWL2 processor cannot compute ordering relationships of values of this type.
       *
       * This term has [1] label and comment, in the language [es].
       */
      generalMonth: _NS$7("generalMonth"),
      /**
       * Year number - formulated as a text string with a pattern constraint to reproduce the same lexical form as gYear, but not restricted to values from the Gregorian calendar.
    Note that the value-space is not defined, so a generic OWL2 processor cannot compute ordering relationships of values of this type.
       *
       * This term has [1] label and comment, in the language [es].
       */
      generalYear: _NS$7("generalYear"),
      /**
       * Beginning of a temporal entity
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasBeginning: _NS$7("hasBeginning"),
      /**
       * Supports the association of a temporal entity (instant or interval) to any thing
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasTime: _NS$7("hasTime"),
      /**
       * Value of DateTimeInterval expressed as a structured value. The beginning and end of the interval coincide with the limits of the shortest element in the description.
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasDateTimeDescription: _NS$7("hasDateTimeDescription"),
      /**
       * Duration of a temporal entity, expressed as a scaled value or nominal value
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasDuration: _NS$7("hasDuration"),
      /**
       * Duration of a temporal entity.
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasTemporalDuration: _NS$7("hasTemporalDuration"),
      /**
       * Duration of a temporal entity, expressed using a structured description
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasDurationDescription: _NS$7("hasDurationDescription"),
      /**
       * End of a temporal entity.
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasEnd: _NS$7("hasEnd"),
      /**
       * Extent of a temporal entity, expressed using xsd:duration
       *
       * This term has [1] label and comment, in the language [es].
       */
      hasXSDDuration: _NS$7("hasXSDDuration"),
      /**
       * Position of an instant, expressed using a structured description
       *
       * This term has [1] label and comment, in the language [es].
       */
      inDateTime: _NS$7("inDateTime"),
      /**
       * Position of a time instant
       *
       * This term has [1] label and comment, in the language [es].
       */
      inTemporalPosition: _NS$7("inTemporalPosition"),
      /**
       * Position of an instant, expressed as a temporal coordinate or nominal value
       *
       * This term has [1] label and comment, in the language [es].
       */
      inTimePosition: _NS$7("inTimePosition"),
      /**
       * Position of an instant, expressed using xsd:date
       *
       * This term has [1] label and comment, in the language [es].
       */
      inXSDDate: _NS$7("inXSDDate"),
      /**
       * Position of an instant, expressed using xsd:dateTime
       *
       * This term has [1] label and comment, in the language [es].
       */
      inXSDDateTime: _NS$7("inXSDDateTime"),
      /**
       * Position of an instant, expressed using xsd:dateTimeStamp
       *
       * This term has [1] label and comment, in the language [es].
       */
      inXSDDateTimeStamp: _NS$7("inXSDDateTimeStamp"),
      /**
       * Position of an instant, expressed using xsd:gYear
       *
       * This term has [1] label and comment, in the language [es].
       */
      inXSDgYear: _NS$7("inXSDgYear"),
      /**
       * Position of an instant, expressed using xsd:gYearMonth
       *
       * This term has [1] label and comment, in the language [es].
       */
      inXSDgYearMonth: _NS$7("inXSDgYearMonth"),
      /**
       * An instant that falls inside the interval. It is not intended to include beginnings and ends of intervals.
       *
       * This term has [1] label and comment, in the language [es].
       */
      inside: _NS$7("inside"),
      /**
       * If a proper interval T1 is intervalAfter another proper interval T2, then the beginning of T1 is after the end of T2.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [1] label in the language [es], but [0] comments.
       */
      intervalAfter: _NS$7("intervalAfter"),
      /**
       * If a proper interval T1 is intervalDisjoint another proper interval T2, then the beginning of T1 is after the end of T2, or the end of T1 is before the beginning of T2, i.e. the intervals do not overlap in any way, but their ordering relationship is not known.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalDisjoint: _NS$7("intervalDisjoint"),
      /**
       * If a proper interval T1 is intervalBefore another proper interval T2, then the end of T1 is before the beginning of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalBefore: _NS$7("intervalBefore"),
      /**
       * If a proper interval T1 is intervalContains another proper interval T2, then the beginning of T1 is before the beginning of T2, and the end of T1 is after the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalContains: _NS$7("intervalContains"),
      /**
       * If a proper interval T1 is intervalDuring another proper interval T2, then the beginning of T1 is after the beginning of T2, and the end of T1 is before the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalDuring: _NS$7("intervalDuring"),
      /**
       * If a proper interval T1 is intervalIn another proper interval T2, then the beginning of T1 is after the beginning of T2 or is coincident with the beginning of T2, and the end of T1 is before the end of T2, or is coincident with the end of T2, except that end of T1 may not be coincident with the end of T2 if the beginning of T1 is coincident with the beginning of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalIn: _NS$7("intervalIn"),
      /**
       * If a proper interval T1 is intervalEquals another proper interval T2, then the beginning of T1 is coincident with the beginning of T2, and the end of T1 is coincident with the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalEquals: _NS$7("intervalEquals"),
      /**
       * If a proper interval T1 is intervalFinishedBy another proper interval T2, then the beginning of T1 is before the beginning of T2, and the end of T1 is coincident with the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalFinishedBy: _NS$7("intervalFinishedBy"),
      /**
       * If a proper interval T1 is intervalFinishes another proper interval T2, then the beginning of T1 is after the beginning of T2, and the end of T1 is coincident with the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalFinishes: _NS$7("intervalFinishes"),
      /**
       * If a proper interval T1 is intervalMeets another proper interval T2, then the end of T1 is coincident with the beginning of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalMeets: _NS$7("intervalMeets"),
      /**
       * If a proper interval T1 is intervalMetBy another proper interval T2, then the beginning of T1 is coincident with the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalMetBy: _NS$7("intervalMetBy"),
      /**
       * If a proper interval T1 is intervalOverlappedBy another proper interval T2, then the beginning of T1 is after the beginning of T2, the beginning of T1 is before the end of T2, and the end of T1 is after the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalOverlappedBy: _NS$7("intervalOverlappedBy"),
      /**
       * If a proper interval T1 is intervalOverlaps another proper interval T2, then the beginning of T1 is before the beginning of T2, the end of T1 is after the beginning of T2, and the end of T1 is before the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalOverlaps: _NS$7("intervalOverlaps"),
      /**
       * If a proper interval T1 is intervalStarted another proper interval T2, then the beginning of T1 is coincident with the beginning of T2, and the end of T1 is after the end of T2.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [0] labels, but [1] comment in the language [es].
       */
      intervalStartedBy: _NS$7("intervalStartedBy"),
      /**
       * If a proper interval T1 is intervalStarts another proper interval T2, then the beginning of T1 is coincident with the beginning of T2, and the end of T1 is before the end of T2.
       *
       * This term has [1] label and comment, in the language [es].
       */
      intervalStarts: _NS$7("intervalStarts"),
      /**
       * Value of DateTimeInterval expressed as a compact value.
       *
       * This term has [1] label and comment, in the language [es].
       */
      xsdDateTime: _NS$7("xsdDateTime"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$6 = new rdfDataFactory.DataFactory();
  function _NS$6(localName) {
      return rdfFactory$6.namedNode("http://www.w3.org/ns/odrl/2/" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * The ODRL Vocabulary and Expression defines a set of concepts and terms (the vocabulary) and encoding mechanism (the expression) for permissions and obligations statements describing digital content usage based on the ODRL Information Model.
   */
  var ODRL = {
      PREFIX: "odrl",
      NAMESPACE: "http://www.w3.org/ns/odrl/2/",
      PREFIX_AND_NAMESPACE: { "odrl": "http://www.w3.org/ns/odrl/2/" },
      NS: _NS$6,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A non-empty group of Permissions and/or Prohibitions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Policy: _NS$6("Policy"),
      /**
       * An unambiguous identifier
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      uid: _NS$6("uid"),
      /**
       * The identifier(s) of an ODRL Profile that the Policy conforms to.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      profile: _NS$6("profile"),
      /**
       * Relates a (child) policy to another (parent) policy from which terms are inherited.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      inheritFrom: _NS$6("inheritFrom"),
      /**
       * An abstract concept that represents the common characteristics of Permissions, Prohibitions, and Duties.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Rule: _NS$6("Rule"),
      /**
       * Relation is an abstract property which creates an explicit link between an Action and an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      relation: _NS$6("relation"),
      /**
       * Function is an abstract property whose sub-properties define the functional roles which may be fulfilled by a party in relation to a Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      function: _NS$6("function"),
      /**
       * Failure is an abstract property that defines the violation (or unmet) relationship between Rules.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      failure: _NS$6("failure"),
      /**
       * Used to establish strategies to resolve conflicts that arise from the merging of Policies or conflicts between Permissions and Prohibitions in the same Policy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      ConflictTerm: _NS$6("ConflictTerm"),
      /**
       * The conflict-resolution strategy for a Policy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      conflict: _NS$6("conflict"),
      /**
       * Permissions take preference over prohibitions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      perm: _NS$6("perm"),
      /**
       * Prohibitions take preference over permissions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      prohibit: _NS$6("prohibit"),
      /**
       * The policy is void.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      invalid: _NS$6("invalid"),
      /**
       * A Policy that grants the assignee a Rule over an Asset from an assigner.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Agreement: _NS$6("Agreement"),
      /**
       * A Policy that proposes a Rule over an Asset from an assigner.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Offer: _NS$6("Offer"),
      /**
       * A Policy that expresses a Rule over an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Set: _NS$6("Set"),
      /**
       * A Policy that asserts a Rule over an Asset from parties.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Assertion: _NS$6("Assertion"),
      /**
       * A Policy that expresses a Rule over an Asset containing personal information.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Privacy: _NS$6("Privacy"),
      /**
       * A Policy that proposes a Rule over an Asset from an assignee.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Request: _NS$6("Request"),
      /**
       * A Policy that grants the holder a Rule over an Asset from an assigner.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Ticket: _NS$6("Ticket"),
      /**
       * A resource or a collection of resources that are the subject of a Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Asset: _NS$6("Asset"),
      /**
       * An Asset that is collection of individual resources
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      AssetCollection: _NS$6("AssetCollection"),
      /**
       * The target property indicates the Asset that is the primary subject to which the Rule action directly applies.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      target: _NS$6("target"),
      /**
       * Identifies an ODRL Policy for which the identified Asset is the target Asset to all the Rules.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      hasPolicy: _NS$6("hasPolicy"),
      /**
       * The output property specifies the Asset which is created from the output of the Action.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      output: _NS$6("output"),
      /**
       * An entity or a collection of entities that undertake Roles in a Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Party: _NS$6("Party"),
      /**
       * A Party that is a group of individual entities
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      PartyCollection: _NS$6("PartyCollection"),
      /**
       * The Party is the recipient of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      assignee: _NS$6("assignee"),
      /**
       * The Party is the issuer of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      assigner: _NS$6("assigner"),
      /**
       * Identifies an ODRL Policy for which the identified Party undertakes the assignee functional role.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      assigneeOf: _NS$6("assigneeOf"),
      /**
       * Identifies an ODRL Policy for which the identified Party undertakes the assigner functional role.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      assignerOf: _NS$6("assignerOf"),
      /**
       * The Party to be attributed.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      attributedParty: _NS$6("attributedParty"),
      /**
       * The Party who undertakes the attribution.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      attributingParty: _NS$6("attributingParty"),
      /**
       * The Party is the recipient of the compensation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      compensatedParty: _NS$6("compensatedParty"),
      /**
       * The Party that is the provider of the compensation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      compensatingParty: _NS$6("compensatingParty"),
      /**
       * The Party to obtain consent from.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      consentingParty: _NS$6("consentingParty"),
      /**
       * The Party who obtains the consent.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      consentedParty: _NS$6("consentedParty"),
      /**
       * The Party who is offering the contract.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      contractingParty: _NS$6("contractingParty"),
      /**
       * The Party who is being contracted.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      contractedParty: _NS$6("contractedParty"),
      /**
       * The Party to be informed of all uses.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      informedParty: _NS$6("informedParty"),
      /**
       * The Party who provides the inform use data.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      informingParty: _NS$6("informingParty"),
      /**
       * The Party who is tracking usage.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      trackingParty: _NS$6("trackingParty"),
      /**
       * The Party whose usage is being tracked.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      trackedParty: _NS$6("trackedParty"),
      /**
       * Identifies an Asset/PartyCollection that the Asset/Party is a member of.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      partOf: _NS$6("partOf"),
      /**
       * Reference to a Asset/PartyCollection
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      source: _NS$6("source"),
      /**
       * An operation on an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Action: _NS$6("Action"),
      /**
       * The operation relating to the Asset for which the Rule is being subjected.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      action: _NS$6("action"),
      /**
       * An Action transitively asserts that another Action that encompasses its operational semantics.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      includedIn: _NS$6("includedIn"),
      /**
       * An Action asserts that another Action is not prohibited to enable its operational semantics.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      implies: _NS$6("implies"),
      /**
       * The ability to perform an Action over an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Permission: _NS$6("Permission"),
      /**
       * Relates an individual Permission to a Policy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      permission: _NS$6("permission"),
      /**
       * The inability to perform an Action over an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Prohibition: _NS$6("Prohibition"),
      /**
       * Relates an individual Prohibition to a Policy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      prohibition: _NS$6("prohibition"),
      /**
       * To use the Asset
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      use: _NS$6("use"),
      /**
       * To transfer the ownership of the Asset in perpetuity.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      transfer: _NS$6("transfer"),
      /**
       * To accept that the use of the Asset may be tracked.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      acceptTracking: _NS$6("acceptTracking"),
      /**
       * To use the Asset or parts of it as part of a composite collection.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      aggregate: _NS$6("aggregate"),
      /**
       * To add explanatory notations/commentaries to the Asset without modifying the Asset in any other way.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      annotate: _NS$6("annotate"),
      /**
       * To anonymize all or parts of the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      anonymize: _NS$6("anonymize"),
      /**
       * To store the Asset (in a non-transient form).
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      archive: _NS$6("archive"),
      /**
       * To attribute the use of the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      attribute: _NS$6("attribute"),
      /**
       * To compensate by transfer of some amount of value, if defined, for using or selling the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      compensate: _NS$6("compensate"),
      /**
       * To create multiple copies of the Asset that are being concurrently used.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      concurrentUse: _NS$6("concurrentUse"),
      /**
       * To permanently remove all copies of the Asset after it has been used.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      delete: _NS$6("delete"),
      /**
       * To create a new derivative Asset from this Asset and to edit or modify the derivative.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      derive: _NS$6("derive"),
      /**
       * To produce a digital copy of (or otherwise digitize) the Asset from its analogue form.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      digitize: _NS$6("digitize"),
      /**
       * To create a static and transient rendition of an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      display: _NS$6("display"),
      /**
       * To supply the Asset to third-parties.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      distribute: _NS$6("distribute"),
      /**
       * To ensure that the Rule on the Asset is exclusive.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      ensureExclusivity: _NS$6("ensureExclusivity"),
      /**
       * To run the computer program Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      execute: _NS$6("execute"),
      /**
       * To extract parts of the Asset and to use it as a new Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      extract: _NS$6("extract"),
      /**
       * To transfer the ownership of the Asset to a third party without compensation and while deleting the original asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      give: _NS$6("give"),
      /**
       * To grant the use of the Asset to third parties.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      grantUse: _NS$6("grantUse"),
      /**
       * To include other related assets in the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      include: _NS$6("include"),
      /**
       * To record the Asset in an index.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      index: _NS$6("index"),
      /**
       * To inform that an action has been performed on or in relation to the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      inform: _NS$6("inform"),
      /**
       * To load the computer program Asset onto a storage device which allows operating or running the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      install: _NS$6("install"),
      /**
       * To change existing content of the Asset. A new asset is not created by this action.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      modify: _NS$6("modify"),
      /**
       * To move the Asset from one digital location to another including deleting the original copy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      move: _NS$6("move"),
      /**
       * To grant the specified Policy to a third party for their use of the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      nextPolicy: _NS$6("nextPolicy"),
      /**
       * To obtain verifiable consent to perform the requested action in relation to the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      obtainConsent: _NS$6("obtainConsent"),
      /**
       * To create a sequential and transient rendition of an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      play: _NS$6("play"),
      /**
       * To publicly perform the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      present: _NS$6("present"),
      /**
       * To create a tangible and permanent rendition of an Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      print: _NS$6("print"),
      /**
       * To obtain data from the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      read: _NS$6("read"),
      /**
       * To make duplicate copies the Asset in any material form.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      reproduce: _NS$6("reproduce"),
      /**
       * To review the Policy applicable to the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      reviewPolicy: _NS$6("reviewPolicy"),
      /**
       * To transfer the ownership of the Asset to a third party with compensation and while deleting the original asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      sell: _NS$6("sell"),
      /**
       * To deliver the Asset in real-time.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      stream: _NS$6("stream"),
      /**
       * To use the Asset in timed relations with media (audio/visual) elements of another Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      synchronize: _NS$6("synchronize"),
      /**
       * To have a text Asset read out loud.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      textToSpeech: _NS$6("textToSpeech"),
      /**
       * To convert the Asset into a different format.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      transform: _NS$6("transform"),
      /**
       * To translate the original natural language of an Asset into another natural language.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      translate: _NS$6("translate"),
      /**
       * To unload and delete the computer program Asset from a storage device and disable its readiness for operation.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      uninstall: _NS$6("uninstall"),
      /**
       * To apply a watermark to the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      watermark: _NS$6("watermark"),
      /**
       * The obligation to perform an Action
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Duty: _NS$6("Duty"),
      /**
       * Relates an individual Duty to a Policy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      obligation: _NS$6("obligation"),
      /**
       * Relates an individual Duty to a Permission.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      duty: _NS$6("duty"),
      /**
       * Relates a Duty to another Duty, the latter being a consequence of not fulfilling the former.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      consequence: _NS$6("consequence"),
      /**
       * Relates an individual remedy Duty to a Prohibition.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      remedy: _NS$6("remedy"),
      /**
       * A boolean expression that refines the semantics of an Action and Party/Asset Collection or declare the conditions applicable to a Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Constraint: _NS$6("Constraint"),
      /**
       * Constraint applied to a Rule
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      constraint: _NS$6("constraint"),
      /**
       * Constraint used to refine the semantics of an Action, or Party/Asset Collection
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      refinement: _NS$6("refinement"),
      /**
       * Operator for constraint expression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Operator: _NS$6("Operator"),
      /**
       * The operator function applied to operands of a Constraint
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      operator: _NS$6("operator"),
      /**
       * Right operand for constraint expression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      RightOperand: _NS$6("RightOperand"),
      /**
       * The value of the right operand in a constraint expression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      rightOperand: _NS$6("rightOperand"),
      /**
       * A reference to a web resource providing the value for the right operand of a Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      rightOperandReference: _NS$6("rightOperandReference"),
      /**
       * Left operand for a constraint expression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      LeftOperand: _NS$6("LeftOperand"),
      /**
       * The left operand in a constraint expression.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      leftOperand: _NS$6("leftOperand"),
      /**
       * The datatype of the value of the rightOperand or rightOperandReference of a Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      dataType: _NS$6("dataType"),
      /**
       * the value generated from the leftOperand action or a value related to the leftOperand set as the reference for the comparison.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      status: _NS$6("status"),
      /**
       * A logical expression that refines the semantics of an Action and Party/Asset Collection or declare the conditions applicable to a Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      LogicalConstraint: _NS$6("LogicalConstraint"),
      /**
       * Operand is an abstract property for a logical relationship.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      operand: _NS$6("operand"),
      /**
       * A point in space or time defined with absolute coordinates for the positioning of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      absolutePosition: _NS$6("absolutePosition"),
      /**
       * The absolute spatial positions of four corners of a rectangle on a 2D-canvas or the eight corners of a cuboid in a 3D-space for the target Asset to fit.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      absoluteSpatialPosition: _NS$6("absoluteSpatialPosition"),
      /**
       * The absolute temporal positions in a media stream the target Asset has to fit.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      absoluteTemporalPosition: _NS$6("absoluteTemporalPosition"),
      /**
       * Measure(s) of one or two axes for 2D-objects or measure(s) of one to tree axes for 3D-objects of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      absoluteSize: _NS$6("absoluteSize"),
      /**
       * Numeric count of executions of the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      count: _NS$6("count"),
      /**
       * The date (and optional time and timezone) of exercising the action of the Rule. Right operand value MUST be an xsd:date or xsd:dateTime as defined by [[xmlschema11-2]].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      dateTime: _NS$6("dateTime"),
      /**
       * A time delay period prior to exercising the action of the Rule. The point in time triggering this period MAY be defined by another temporal Constraint combined by a Logical Constraint (utilising the odrl:andSequence operand). Right operand value MUST be an xsd:duration as defined by [[xmlschema11-2]].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      delayPeriod: _NS$6("delayPeriod"),
      /**
       * The delivery channel used for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      deliveryChannel: _NS$6("deliveryChannel"),
      /**
       * A continuous elapsed time period which may be used for exercising of the action of the Rule. Right operand value MUST be an xsd:duration as defined by [[xmlschema11-2]].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      elapsedTime: _NS$6("elapsedTime"),
      /**
       * An identified event setting a context for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      event: _NS$6("event"),
      /**
       * A transformed file format of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      fileFormat: _NS$6("fileFormat"),
      /**
       * A defined industry sector setting a context for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      industry: _NS$6("industry"),
      /**
       * A natural language used by the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      language: _NS$6("language"),
      /**
       * Category of a media asset setting a context for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      media: _NS$6("media"),
      /**
       * An accumulated amount of one to many metered time periods which were used for exercising the action of the Rule. Right operand value MUST be an xsd:duration as defined by [[xmlschema11-2]].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      meteredTime: _NS$6("meteredTime"),
      /**
       * The amount of a financial payment. Right operand value MUST be an xsd:decimal.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      payAmount: _NS$6("payAmount"),
      /**
       * A percentage amount of the target Asset relevant for exercising the action of the Rule. Right operand value MUST be an xsd:decimal from 0 to 100.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      percentage: _NS$6("percentage"),
      /**
       * Category of product or service setting a context for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      product: _NS$6("product"),
      /**
       * A defined purpose for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      purpose: _NS$6("purpose"),
      /**
       * The party receiving the result/outcome of exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      recipient: _NS$6("recipient"),
      /**
       * A point in space or time defined with coordinates relative to full measures the positioning of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      relativePosition: _NS$6("relativePosition"),
      /**
       * The relative spatial positions - expressed as percentages of full values - of four corners of a rectangle on a 2D-canvas or the eight corners of a cuboid in a 3D-space of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      relativeSpatialPosition: _NS$6("relativeSpatialPosition"),
      /**
       * A point in space or time defined with coordinates relative to full measures the positioning of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      relativeTemporalPosition: _NS$6("relativeTemporalPosition"),
      /**
       * Measure(s) of one or two axes for 2D-objects or measure(s) of one to tree axes for 3D-objects - expressed as percentages of full values - of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      relativeSize: _NS$6("relativeSize"),
      /**
       * Resolution of the rendition of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      resolution: _NS$6("resolution"),
      /**
       * A named and identified geospatial area with defined borders which is used for exercising the action of the Rule. An IRI MUST be used to represent this value.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      spatial: _NS$6("spatial"),
      /**
       * A set of coordinates setting the borders of a geospatial area used for exercising the action of the Rule. The coordinates MUST include longitude and latitude, they MAY include altitude and the geodetic datum.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      spatialCoordinates: _NS$6("spatialCoordinates"),
      /**
       * An identified computing system or computing device used for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      systemDevice: _NS$6("systemDevice"),
      /**
       * A recurring period of time before the next execution of the action of the Rule. Right operand value MUST be an xsd:duration as defined by [[xmlschema11-2]].
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      timeInterval: _NS$6("timeInterval"),
      /**
       * The unit of measure used for counting the executions of the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      unitOfCount: _NS$6("unitOfCount"),
      /**
       * The version of the target Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      version: _NS$6("version"),
      /**
       * An identified location of the IT communication space which is relevant for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      virtualLocation: _NS$6("virtualLocation"),
      /**
       * The relation is satisfied when at least one of the Constraints is satisfied.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      or: _NS$6("or"),
      /**
       * The relation is satisfied when only one, and not more, of the Constaints is satisfied
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      xone: _NS$6("xone"),
      /**
       * The relation is satisfied when all of the Constraints are satisfied.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      and: _NS$6("and"),
      /**
       * The relation is satisfied when each of the Constraints are satisfied in the order specified.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      andSequence: _NS$6("andSequence"),
      /**
       * Indicating that a given value equals the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      eq: _NS$6("eq"),
      /**
       * Indicating that a given value is greater than the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      gt: _NS$6("gt"),
      /**
       * Indicating that a given value is greater than or equal to the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      gteq: _NS$6("gteq"),
      /**
       * Indicating that a given value is less than the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      lt: _NS$6("lt"),
      /**
       * Indicating that a given value is less than or equal to the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      lteq: _NS$6("lteq"),
      /**
       * Indicating that a given value is not equal to the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      neq: _NS$6("neq"),
      /**
       * A set-based operator indicating that a given value is an instance of the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      isA: _NS$6("isA"),
      /**
       * A set-based operator indicating that a given value contains the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      hasPart: _NS$6("hasPart"),
      /**
       * A set-based operator indicating that a given value is contained by the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      isPartOf: _NS$6("isPartOf"),
      /**
       * A set-based operator indicating that a given value is all of the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      isAllOf: _NS$6("isAllOf"),
      /**
       * A set-based operator indicating that a given value is any of the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      isAnyOf: _NS$6("isAnyOf"),
      /**
       * A set-based operator indicating that a given value is none of the right operand of the Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      isNoneOf: _NS$6("isNoneOf"),
      /**
       * Indicates the actual datetime the action of the Rule was exercised.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      policyUsage: _NS$6("policyUsage"),
      /**
       * An identified device used for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      device: _NS$6("device"),
      /**
       * An identified computing system used for exercising the action of the Rule.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      system: _NS$6("system"),
      /**
       * An value indicating the closeness or nearness.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      proximity: _NS$6("proximity"),
      /**
       * The act of adding to the end of an asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      append: _NS$6("append"),
      /**
       * The act of appending data to the Asset without modifying the Asset in any other way.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      appendTo: _NS$6("appendTo"),
      /**
       * The act of making an exact reproduction of the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      copy: _NS$6("copy"),
      /**
       * The act of transforming the asset into a new form.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      export: _NS$6("export"),
      /**
       * The act of making available the asset to a third-party for a fixed period of time with exchange of value.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      lease: _NS$6("lease"),
      /**
       * The act of granting the right to use the asset to a third-party.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      license: _NS$6("license"),
      /**
       * The act of making available the asset to a third-party for a fixed period of time without exchange of value.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      lend: _NS$6("lend"),
      /**
       * The act of paying a financial amount to a party for use of the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      pay: _NS$6("pay"),
      /**
       * The Party is the recipient of the payment.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      payeeParty: _NS$6("payeeParty"),
      /**
       * The act of providing a short preview of the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      preview: _NS$6("preview"),
      /**
       * The act of using the asset for a purpose other than the purpose it was intended for.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      secondaryUse: _NS$6("secondaryUse"),
      /**
       * The act of writing to the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      write: _NS$6("write"),
      /**
       * The act of adding data to the Asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      writeTo: _NS$6("writeTo"),
      /**
       * The act of sharing the asset to parties in close proximity to the owner.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      adHocShare: _NS$6("adHocShare"),
      /**
       * The act of extracting (replicating) unchanged characters from the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      extractChar: _NS$6("extractChar"),
      /**
       * The act of extracting (replicating) unchanged pages from the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      extractPage: _NS$6("extractPage"),
      /**
       * The act of extracting (replicating) unchanged words from the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      extractWord: _NS$6("extractWord"),
      /**
       * The number of seconds after which timed metering use of the asset begins.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      timedCount: _NS$6("timedCount"),
      /**
       * Indentifies the type of inheritance.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      inheritRelation: _NS$6("inheritRelation"),
      /**
       * Indicates if the Policy entity can be inherited.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      inheritAllowed: _NS$6("inheritAllowed"),
      /**
       * Is used to indicate how to support Actions that are not part of any vocabulary or profile in the policy expression system.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      UndefinedTerm: _NS$6("UndefinedTerm"),
      /**
       * Relates the strategy used for handling undefined actions to a Policy.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      undefined: _NS$6("undefined"),
      /**
       * The Action is to be ignored and is not part of the policy – and the policy remains valid.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      ignore: _NS$6("ignore"),
      /**
       * The Action is to be supported as part of the policy – and the policy remains valid.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      support: _NS$6("support"),
      /**
       * Scopes for Asset Scope expressions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      AssetScope: _NS$6("AssetScope"),
      /**
       * Scopes for Party Scope expressions.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      PartyScope: _NS$6("PartyScope"),
      /**
       * The identifier of a scope that provides context to the extent of the entity.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      scope: _NS$6("scope"),
      /**
       * Specifies that the scope of the relationship is the defined group with multiple individual members.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Group: _NS$6("Group"),
      /**
       * Specifies that the scope of the relationship is the single Party individual.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      Individual: _NS$6("Individual"),
      /**
       * Specifies that the scope of the relationship is all of the collective individuals within a context.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      All: _NS$6("All"),
      /**
       * Specifies that the scope of the relationship is all of the first-level connections of the Party.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      AllConnections: _NS$6("AllConnections"),
      /**
       * Specifies that the scope of the relationship is all of the second-level connections to the Party.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      All2ndConnections: _NS$6("All2ndConnections"),
      /**
       * Specifies that the scope of the relationship is all of the group connections of the Party.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      AllGroups: _NS$6("AllGroups"),
      /**
       * The act of keeping the policy notice with the asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      attachPolicy: _NS$6("attachPolicy"),
      /**
       * The act of attaching the source of the asset and its derivatives.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      attachSource: _NS$6("attachSource"),
      /**
       * The act of distributing any derivative asset under the same terms as the original asset.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      shareAlike: _NS$6("shareAlike"),
      /**
       * The act of using the asset in a business environment.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      commercialize: _NS$6("commercialize"),
      /**
       * The act of the non-commercial reproduction and distribution of the asset to third-parties.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      share: _NS$6("share"),
      /**
       * Identifier for the ODRL Core Profile
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      core: _NS$6("core"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * The unit of measurement of the value of the rightOperand or rightOperandReference of a Constraint.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/odrl/2/
       */
      unit: _NS$6("unit"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$5 = new rdfDataFactory.DataFactory();
  function _NS$5(localName) {
      return rdfFactory$5.namedNode("https://w3id.org/security#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Security vocabulary
   */
  var SEC = {
      PREFIX: "sec",
      NAMESPACE: "https://w3id.org/security#",
      PREFIX_AND_NAMESPACE: { "sec": "https://w3id.org/security#" },
      NS: _NS$5,
      // *****************
      // All the Classes.
      // *****************
      /**
       *
       */
      EcdsaSecp256k1Signature2019: _NS$5("EcdsaSecp256k1Signature2019"),
      /**
       *
       */
      EcdsaSecp256k1VerificationKey2019: _NS$5("EcdsaSecp256k1VerificationKey2019"),
      /**
       *
       */
      RsaSignature2018: _NS$5("RsaSignature2018"),
      /**
       *
       */
      RsaVerificationKey2018: _NS$5("RsaVerificationKey2018"),
      /**
       *
       */
      SchnorrSecp256k1Signature2019: _NS$5("SchnorrSecp256k1Signature2019"),
      /**
       *
       */
      SchnorrSecp256k1VerificationKey2019: _NS$5("SchnorrSecp256k1VerificationKey2019"),
      /**
       *
       */
      ServiceEndpointProxyService: _NS$5("ServiceEndpointProxyService"),
      /**
       *
       */
      Digest: _NS$5("Digest"),
      /**
       *
       */
      EncryptedMessage: _NS$5("EncryptedMessage"),
      /**
       *
       */
      Signature: _NS$5("Signature"),
      /**
       *
       */
      LinkedDataSignature2015: _NS$5("LinkedDataSignature2015"),
      /**
       *
       */
      Ed25519VerificationKey2018: _NS$5("Ed25519VerificationKey2018"),
      /**
       *
       */
      BbsBlsSignature2020: _NS$5("BbsBlsSignature2020"),
      /**
       *
       */
      BbsBlsSignatureProof2020: _NS$5("BbsBlsSignatureProof2020"),
      /**
       *
       */
      Bls12381G1Key2020: _NS$5("Bls12381G1Key2020"),
      /**
       *
       */
      Bls12381G2Key2020: _NS$5("Bls12381G2Key2020"),
      /**
       *
       */
      Key: _NS$5("Key"),
      // *******************
      // All the Properties.
      // *******************
      /**
       *
       */
      cipherAlgorithm: _NS$5("cipherAlgorithm"),
      /**
       *
       */
      cipherData: _NS$5("cipherData"),
      /**
       *
       */
      digestAlgorithm: _NS$5("digestAlgorithm"),
      /**
       *
       */
      digestValue: _NS$5("digestValue"),
      /**
       *
       */
      cipherKey: _NS$5("cipherKey"),
      /**
       *
       */
      blockchainAccountId: _NS$5("blockchainAccountId"),
      /**
       *
       */
      ethereumAddress: _NS$5("ethereumAddress"),
      /**
       *
       */
      expires: _NS$5("expires"),
      /**
       *
       */
      initializationVector: _NS$5("initializationVector"),
      /**
       *
       */
      nonce: _NS$5("nonce"),
      /**
       *
       */
      canonicalizationAlgorithm: _NS$5("canonicalizationAlgorithm"),
      /**
       *
       */
      owner: _NS$5("owner"),
      /**
       *
       */
      password: _NS$5("password"),
      /**
       *
       */
      privateKeyPem: _NS$5("privateKeyPem"),
      /**
       *
       */
      verificationMethod: _NS$5("verificationMethod"),
      /**
       *
       */
      publicKey: _NS$5("publicKey"),
      /**
       *
       */
      assertionMethod: _NS$5("assertionMethod"),
      /**
       *
       */
      authentication: _NS$5("authentication"),
      /**
       *
       */
      capabilityDelegation: _NS$5("capabilityDelegation"),
      /**
       *
       */
      capabilityInvocation: _NS$5("capabilityInvocation"),
      /**
       *
       */
      keyAgreement: _NS$5("keyAgreement"),
      /**
       *
       */
      publicKeyBase58: _NS$5("publicKeyBase58"),
      /**
       *
       */
      publicKeyJwk: _NS$5("publicKeyJwk"),
      /**
       *
       */
      publicKeyPem: _NS$5("publicKeyPem"),
      /**
       *
       */
      publicKeyHex: _NS$5("publicKeyHex"),
      /**
       *
       */
      publicKeyService: _NS$5("publicKeyService"),
      /**
       *
       */
      revoked: _NS$5("revoked"),
      /**
       *
       */
      proof: _NS$5("proof"),
      /**
       *
       */
      jws: _NS$5("jws"),
      /**
       *
       */
      proofPurpose: _NS$5("proofPurpose"),
      /**
       *
       */
      challenge: _NS$5("challenge"),
      /**
       *
       */
      domain: _NS$5("domain"),
      /**
       *
       */
      expiration: _NS$5("expiration"),
      /**
       *
       */
      proofValue: _NS$5("proofValue"),
      /**
       *
       */
      signature: _NS$5("signature"),
      /**
       *
       */
      signatureValue: _NS$5("signatureValue"),
      /**
       *
       */
      signatureAlgorithm: _NS$5("signatureAlgorithm"),
      /**
       *
       */
      service: _NS$5("service"),
      /**
       *
       */
      serviceEndpoint: _NS$5("serviceEndpoint"),
      /**
       *
       */
      allowedAction: _NS$5("allowedAction"),
      /**
       *
       */
      capability: _NS$5("capability"),
      /**
       *
       */
      capabilityAction: _NS$5("capabilityAction"),
      /**
       *
       */
      capabilityChain: _NS$5("capabilityChain"),
      /**
       *
       */
      caveat: _NS$5("caveat"),
      /**
       *
       */
      delegator: _NS$5("delegator"),
      /**
       *
       */
      invocationTarget: _NS$5("invocationTarget"),
      /**
       *
       */
      invoker: _NS$5("invoker"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$4 = new rdfDataFactory.DataFactory();
  function _NS$4(localName) {
      return rdfFactory$4.namedNode("http://www.w3.org/ns/json-ld#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * This is a vocabulary document and is used to achieve certain features of the JSON-LD language.
   */
  var JSONLD = {
      PREFIX: "jsonld",
      NAMESPACE: "http://www.w3.org/ns/json-ld#",
      PREFIX_AND_NAMESPACE: { "jsonld": "http://www.w3.org/ns/json-ld#" },
      NS: _NS$4,
      // *****************
      // All the Classes.
      // *****************
      /**
       * Defines term definitions and other aspects of a JSON-LD `Context`.
    
    A [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) MUST be a map whose keys MUST be either _terms_, _compact IRIs_, _IRIs_, or one of the keywords `@base`, `@import`, `@language`, `@propagate`, `@protected`, `@type`, `@version`, or `@vocab`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      Context: _NS$4("Context"),
      /**
       * A string ([simple term definition](http://www.w3.org/TR/json-ld11/#dfn-simple-term-definitions)), expanding to an IRI.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#dfn-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      PrefixDefinition: _NS$4("PrefixDefinition"),
      /**
       * A [term definition](http://www.w3.org/TR/json-ld11/#dfn-term-definitions) is an entry in a [context](#Context), where the key defines a term which may be used within a dictionary as a key, type, or elsewhere that a string is interpreted as a vocabulary item. Its value is an [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definitions).
    
    
    
    An [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definition) MUST be a map composed of zero or more keys from `@id`, `@reverse`, `@type`, `@language`, `@container`, `@context`, `@prefix`, `@propagate`, or `@protected`. An expanded term definition SHOULD NOT contain any other keys.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#dfn-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      TermDefinition: _NS$4("TermDefinition"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * If the [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) has an `@base` key, its value MUST be an _IRI reference_, or `null`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      base: _NS$4("base"),
      /**
       * This profile IRI is used to request or specify compacted JSON-LD document form.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#iana-considerations
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      compacted: _NS$4("compacted"),
      /**
       * The associated `@container` value in an [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definitions).
    
    If the [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definitions) contains the `@container` keyword, its value MUST be either `@list`, `@set`, `@language`, `@index`, `@id`, `@graph`, `@type`, or be `null` or an array containing exactly any one of those keywords, or a combination of `@set` and any of `@index`, `@id`, `@graph`, `@type`, `@language` in any order.
    
    `@container` may also be an array containing `@graph` along with either `@id` or `@index` and also optionally including `@set`.
    
    If the value is `@language`, when the term is used outside of the `@context`, the associated value MUST be a language map.
    
    If the value is `@index`, when the term is used outside of the `@context`, the associated value MUST be an index map.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#expanded-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      container: _NS$4("container"),
      /**
       * As an IRI, this link relation is used to associate a JSON-LD context with a JSON document so that it can be interpreted as JSON-LD. In an HTTP request header, specifies the location of a context to use for compaction. As a Context, defines an inline `context definition`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#interpreting-json-as-json-ld
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      context: _NS$4("context"),
      /**
       * Term definition(s) associated with this context.
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      definition: _NS$4("definition"),
      /**
       * If the [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) has an `@direction` key, its value MUST be one of `"ltr"` or `"rtl"`, or be `null`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      direction: _NS$4("direction"),
      /**
       * This profile URI is used to request or specify expanded JSON-LD document form.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#iana-considerations
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      expanded: _NS$4("expanded"),
      /**
       * This profile URI is used to request or specify flattened JSON-LD document form.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#iana-considerations
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      flattened: _NS$4("flattened"),
      /**
       * As an IRI, this link relation is used to associate a JSON-LD frame with a JSON-LD document. In an HTTP request header, specifies the location of a frame to use for framing.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#iana-considerations
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      frame: _NS$4("frame"),
      /**
       * This profile URI is used to request or specify framed JSON-LD document form.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#iana-considerations
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      framed: _NS$4("framed"),
      /**
       * The `@id` mapping of a [term definition](#TermDefinition).
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#expanded-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      id: _NS$4("id"),
      /**
       * If the [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) contains the `@import` keyword, its value MUST be an _IRI reference_. When used as a reference from an `@import`, the referenced context definition MUST NOT include an `@import` key, itself.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      import: _NS$4("import"),
      /**
       * The [default language](https://www.w3.org/TR/json-ld11/#dfn-default-language) is set in the context using the `@language` key whose value MUST be a string representing a [BCP47](https://tools.ietf.org/html/bcp47) language code or null.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#dfn-default-language
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      language: _NS$4("language"),
      /**
       * If the [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definitions) contains the `@nest` keyword, its value MUST be either `@nest`, or a _term_ which expands to `@nest`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#expanded-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      nest: _NS$4("nest"),
      /**
       * With the value `true`, allows this term to be used to construct a compact IRI when compacting.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#expanded-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      prefix: _NS$4("prefix"),
      /**
       * If the [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) contains the `@propagate` keyword, its value MUST be `true` or `false`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      propagate: _NS$4("propagate"),
      /**
       * If the [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) contains the `@protected` keyword, its value MUST be `true` or `false`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      protected: _NS$4("protected"),
      /**
       * The `@reverse` mapping of an [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definitions).
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#expanded-term-definition
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      reverse: _NS$4("reverse"),
      /**
       * This profile URI is used to request or specify streaming JSON-LD document form.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11-streaming/#streaming-profile
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      streaming: _NS$4("streaming"),
      /**
       * The term associated with a [term definition](#TermDefinition).
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#dfn-term
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      term: _NS$4("term"),
      /**
       * If the [context definition](https://www.w3.org/TR/json-ld11/#dfn-context-definition) contains the `@type` keyword, its value MUST be a map with only the entry `@container` set to `@set`, and optionally an entry `@protected`.
    
    
    
    If the [expanded term definition](https://www.w3.org/TR/json-ld11/#dfn-expanded-term-definitions) contains the `@type` keyword, its value MUST be an _IRI reference_, a _term_, `null`, or one of the keywords `@id`, `@json`, `@none`, or `@vocab`.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#context-definitions
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      type: _NS$4("type"),
      /**
       * The [processing mode](https://www.w3.org/TR/json-ld11/#dfn-processing-mode) defines how a JSON-LD document is processed. By default, all documents are assumed to be conformant with [JSON-LD 1.1`](http://www.w3.org/TR/json-ld11). By defining a different version via explicit API option, other processing modes can be accessed. This specification defines extensions for the `json-ld-1.1` processing mode.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#dfn-processing-mode
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      version: _NS$4("version"),
      /**
       * Used to expand properties and values in `@type` with a common prefix IRI.
       *
       * See also:
       *  - https://www.w3.org/TR/json-ld11/#default-vocabulary
       *
       * Defined by the vocabulary: http://www.w3.org/ns/json-ld#
       */
      vocab: _NS$4("vocab"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$3 = new rdfDataFactory.DataFactory();
  function _NS$3(localName) {
      return rdfFactory$3.namedNode("http://www.w3.org/ns/earl#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Evaluation and Report Language (EARL)
   */
  var EARL = {
      PREFIX: "earl",
      NAMESPACE: "http://www.w3.org/ns/earl#",
      PREFIX_AND_NAMESPACE: { "earl": "http://www.w3.org/ns/earl#" },
      NS: _NS$3,
      // *****************
      // All the Classes.
      // *****************
      /**
       * a statement that embodies the results of a test
       */
      Assertion: _NS$3("Assertion"),
      /**
       * an entity such as a person, a software tool, an organization, or any other grouping that carries out a test collectively
       */
      Assertor: _NS$3("Assertor"),
      /**
       * the class of things that have been tested against some test criterion
       */
      TestSubject: _NS$3("TestSubject"),
      /**
       * a testable statement, usually one that can be passed or failed
       */
      TestCriterion: _NS$3("TestCriterion"),
      /**
       * a higher-level requirement that is tested by executing one or more sub-tests
       */
      TestRequirement: _NS$3("TestRequirement"),
      /**
       * an atomic test, usually one that is a partial test for a requirement
       */
      TestCase: _NS$3("TestCase"),
      /**
       * the actual result of performing the test
       */
      TestResult: _NS$3("TestResult"),
      /**
       * describes how a test was carried out
       */
      TestMode: _NS$3("TestMode"),
      /**
       * a discrete value that describes a resulting condition from carrying out the test
       */
      OutcomeValue: _NS$3("OutcomeValue"),
      /**
       * the class of outcomes to denote passing a test
       */
      Pass: _NS$3("Pass"),
      /**
       * the class of outcomes to denote failing a test
       */
      Fail: _NS$3("Fail"),
      /**
       * the class of outcomes to denote an undetermined outcome
       */
      CannotTell: _NS$3("CannotTell"),
      /**
       * the class of outcomes to denote the test is not applicable
       */
      NotApplicable: _NS$3("NotApplicable"),
      /**
       * the class of outcomes to denote the test has not been carried out
       */
      NotTested: _NS$3("NotTested"),
      /**
       * any piece of software such as an authoring tool, browser, or evaluation tool
       */
      Software: _NS$3("Software"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * assertor of an assertion
       */
      assertedBy: _NS$3("assertedBy"),
      /**
       * test subject of an assertion
       */
      subject: _NS$3("subject"),
      /**
       * test criterion of an assertion
       */
      test: _NS$3("test"),
      /**
       * result of an assertion
       */
      result: _NS$3("result"),
      /**
       * mode in which the test was performed
       */
      mode: _NS$3("mode"),
      /**
       * assertor that is primarily responsible for performing the test
       */
      mainAssertor: _NS$3("mainAssertor"),
      /**
       * outcome of performing the test
       */
      outcome: _NS$3("outcome"),
      /**
       * location within a test subject that are most relevant to a test result
       */
      pointer: _NS$3("pointer"),
      /**
       * additional warnings or error messages in a human-readable form
       */
      info: _NS$3("info"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$2 = new rdfDataFactory.DataFactory();
  function _NS$2(localName) {
      return rdfFactory$2.namedNode("http://www.w3.org/2003/06/sw-vocab-status/ns#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * This vocabulary was created in the FOAF project, based on experience with FOAF, Dublin Core and other early RDF vocabularies. Deployment experience shows that changing namespace URIs is expensive and unrewarding, so this vocabulary provides terms to support in-place evolution of structured data vocabularies. By indicating status at the level of terms rather than vocabularies, dictionary-style, fine grained improvements become easier. Different organizations and parties can agree or disagree on the status of a vocabulary term; however the status published alongside the term may deserve special attention. Future work could include patterns for citing announcements and decisions, or using SKOS to decentralise the extension of the basic status levels.
   */
  var VS = {
      PREFIX: "vs",
      NAMESPACE: "http://www.w3.org/2003/06/sw-vocab-status/ns#",
      PREFIX_AND_NAMESPACE: { "vs": "http://www.w3.org/2003/06/sw-vocab-status/ns#" },
      NS: _NS$2,
      // *******************
      // All the Properties.
      // *******************
      /**
       * the status of a vocabulary term, expressed as a short symbolic string; known values include 'unstable','testing', 'stable' and 'archaic'
       *
       * Defined by the vocabulary: http://www.w3.org/2003/06/sw-vocab-status/ns#
       */
      term_status: _NS$2("term_status"),
      /**
       * more information about the status etc of a term, typically human oriented
       *
       * Defined by the vocabulary: http://www.w3.org/2003/06/sw-vocab-status/ns#
       */
      moreinfo: _NS$2("moreinfo"),
      /**
       * human-oriented documentation, examples etc for use of this term
       *
       * Defined by the vocabulary: http://www.w3.org/2003/06/sw-vocab-status/ns#
       */
      userdocs: _NS$2("userdocs"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory$1 = new rdfDataFactory.DataFactory();
  function _NS$1(localName) {
      return rdfFactory$1.namedNode("http://usefulinc.com/ns/doap#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * [Generator provided] - Description of a Project (DOAP) vocabulary
   */
  var DOAP = {
      PREFIX: "doap",
      NAMESPACE: "http://usefulinc.com/ns/doap#",
      PREFIX_AND_NAMESPACE: { "doap": "http://usefulinc.com/ns/doap#" },
      NS: _NS$1,
      // *****************
      // All the Classes.
      // *****************
      /**
       * A project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      Project: _NS$1("Project"),
      /**
       * Version information of a project release.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      Version: _NS$1("Version"),
      /**
       * A specification of a system's aspects, technical or otherwise.
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      Specification: _NS$1("Specification"),
      /**
       * Source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      Repository: _NS$1("Repository"),
      /**
       * Subversion source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      SVNRepository: _NS$1("SVNRepository"),
      /**
       * Git source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      GitRepository: _NS$1("GitRepository"),
      /**
       * BitKeeper source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      BKRepository: _NS$1("BKRepository"),
      /**
       * CVS source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      CVSRepository: _NS$1("CVSRepository"),
      /**
       * GNU Arch source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      ArchRepository: _NS$1("ArchRepository"),
      /**
       * Bazaar source code branch.
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      BazaarBranch: _NS$1("BazaarBranch"),
      /**
       * Git source code branch.
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      GitBranch: _NS$1("GitBranch"),
      /**
       * Mercurial source code repository.
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      HgRepository: _NS$1("HgRepository"),
      /**
       * darcs source code repository.
       *
       * This term has [3] labels and comments, in the languages [es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      DarcsRepository: _NS$1("DarcsRepository"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * A name of something.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      name: _NS$1("name"),
      /**
       * URL of a project's homepage,
            associated with exactly one project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      homepage: _NS$1("homepage"),
      /**
       * URL of a project's past homepage,
            associated with exactly one project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      old_homepage: _NS$1("old-homepage"),
      /**
       * Date when something was created, in YYYY-MM-DD form. e.g. 2004-04-05
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      created: _NS$1("created"),
      /**
       * Short (8 or 9 words) plain text description of a project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      shortdesc: _NS$1("shortdesc"),
      /**
       * Plain text description of a project, of 2-4 sentences in length.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      description: _NS$1("description"),
      /**
       * A project release.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      release: _NS$1("release"),
      /**
       * Mailing list home page or email address.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      mailing_list: _NS$1("mailing-list"),
      /**
       * A forum or community that supports this project.
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      support_forum: _NS$1("support-forum"),
      /**
       * A forum or community for developers of this project.
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      developer_forum: _NS$1("developer-forum"),
      /**
       * A category of project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      category: _NS$1("category"),
      /**
       * The URI of an RDF description of the license the software is distributed under. E.g. a SPDX reference
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      license: _NS$1("license"),
      /**
       * Source code repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      repository: _NS$1("repository"),
      /**
       * The project that uses a repository.
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      repositoryOf: _NS$1("repositoryOf"),
      /**
       * Repository for anonymous access.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      anon_root: _NS$1("anon-root"),
      /**
       * Web browser interface to repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      browse: _NS$1("browse"),
      /**
       * Module name of a Subversion, CVS, BitKeeper or Arch repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      module: _NS$1("module"),
      /**
       * Location of a repository.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      location: _NS$1("location"),
      /**
       * Web page from which the project software can be downloaded.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      download_page: _NS$1("download-page"),
      /**
       * Mirror of software download web page.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      download_mirror: _NS$1("download-mirror"),
      /**
       * Revision identifier of a software release.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      revision: _NS$1("revision"),
      /**
       * URI of download associated with this release.
       *
       * This term has [2] labels and comments, in the languages [cs, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      file_release: _NS$1("file-release"),
      /**
       * URL of Wiki for collaborative discussion of project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      wiki: _NS$1("wiki"),
      /**
       * Bug tracker for a project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      bug_database: _NS$1("bug-database"),
      /**
       * Web page with screenshots of project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      screenshots: _NS$1("screenshots"),
      /**
       * Maintainer of a project, a project leader.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      maintainer: _NS$1("maintainer"),
      /**
       * Developer of software for the project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      developer: _NS$1("developer"),
      /**
       * Contributor of documentation to the project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      documenter: _NS$1("documenter"),
      /**
       * Contributor of translations to the project.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      translator: _NS$1("translator"),
      /**
       * A tester or other quality control contributor.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      tester: _NS$1("tester"),
      /**
       * Project contributor.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      helper: _NS$1("helper"),
      /**
       * Programming language a project is implemented in or intended for use with.
       *
       * This term has [5] labels and comments, in the languages [cs, de, es, fr, pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      programming_language: _NS$1("programming-language"),
      /**
       * Operating system that a project is limited to.  Omit this property if the project is not OS-specific.
       *
       * This term provides non-English descriptions, but a mismatch between labels and comments, with [5] labels in languages [cs, de, es, fr, pt], but [4] comments in languages [cs, de, es, fr].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      os: _NS$1("os"),
      /**
       * A specification that a project implements. Could be a standard, API or legally defined level of conformance.
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      implements: _NS$1("implements"),
      /**
       * The URI of a web service endpoint where software as a service may be accessed
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      service_endpoint: _NS$1("service-endpoint"),
      /**
       * ISO language code a project has been translated into
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      language: _NS$1("language"),
      /**
       * Vendor organization: commercial, free or otherwise
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      vendor: _NS$1("vendor"),
      /**
       * Indicator of software platform (non-OS specific), e.g. Java, Firefox, ECMA CLR
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      platform: _NS$1("platform"),
      /**
       * Description of target user base
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      audience: _NS$1("audience"),
      /**
       * URI of a blog related to a project
       *
       * This term has [1] label and comment, in the language [pt].
       *
       * Defined by the vocabulary: http://usefulinc.com/ns/doap#
       */
      blog: _NS$1("blog"),
  };

  /**
   * MIT License
   *
   * Copyright 2020 Inrupt Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the &quot;Software&quot;), to deal in
   * the Software without restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
   * Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
   * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var rdfFactory = new rdfDataFactory.DataFactory();
  function _NS(localName) {
      return rdfFactory.namedNode("https://www.w3.org/2018/credentials#" + localName);
  }
  // Add 'any' type annotation in case this vocab includes 'NamedNode' instances,
  // for example instances of Constant IRIs (TypeScript compiler will complain of
  // "semantic error TS2742" otherwise).
  /**
   * A vocabulary for the Data Model for W3C Verifiable Credentials.
   */
  var CRED = {
      PREFIX: "cred",
      NAMESPACE: "https://www.w3.org/2018/credentials#",
      PREFIX_AND_NAMESPACE: { "cred": "https://www.w3.org/2018/credentials#" },
      NS: _NS,
      // *****************
      // All the Classes.
      // *****************
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      VerifiableCredential: _NS("VerifiableCredential"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      JsonSchemaValidator2018: _NS("JsonSchemaValidator2018"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      ManualRefreshService2018: _NS("ManualRefreshService2018"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      VerifiablePresentation: _NS("VerifiablePresentation"),
      // *******************
      // All the Properties.
      // *******************
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      verifiableCredential: _NS("verifiableCredential"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      credentialSchema: _NS("credentialSchema"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      credentialStatus: _NS("credentialStatus"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      credentialSubject: _NS("credentialSubject"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      evidence: _NS("evidence"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      expirationDate: _NS("expirationDate"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      holder: _NS("holder"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      issued: _NS("issued"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      issuer: _NS("issuer"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      issuanceDate: _NS("issuanceDate"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      refreshService: _NS("refreshService"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      termsOfUse: _NS("termsOfUse"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      validFrom: _NS("validFrom"),
      /**
       * .
       *
       * Defined by the vocabulary: https://www.w3.org/2018/credentials#
       */
      validUntil: _NS("validUntil"),
  };

  exports.ACL = ACL;
  exports.ALTR = ALTR;
  exports.AS = AS;
  exports.BOOKMARK = BOOKMARK;
  exports.CRED = CRED;
  exports.DCAT = DCAT;
  exports.DCTERMS = DCTERMS;
  exports.DOAP = DOAP;
  exports.EARL = EARL;
  exports.FOAF = FOAF;
  exports.HTTP = HTTP;
  exports.HTTPH_INRUPT = HTTPH_INRUPT;
  exports.HYDRA = HYDRA;
  exports.ICAL = ICAL;
  exports.JSONLD = JSONLD;
  exports.LDP = LDP;
  exports.LDP_INRUPT = LDP_INRUPT;
  exports.ODRL = ODRL;
  exports.OLO = OLO;
  exports.OWL = OWL;
  exports.POSIX = POSIX;
  exports.PROV_O = PROV_O;
  exports.QB = QB;
  exports.RDF = RDF;
  exports.RDFS = RDFS;
  exports.RDF_INRUPT = RDF_INRUPT;
  exports.RLOG = RLOG;
  exports.SCHEMA_INRUPT = SCHEMA_INRUPT;
  exports.SD = SD;
  exports.SDMX_DIMENSION = SDMX_DIMENSION;
  exports.SEC = SEC;
  exports.SHEX = SHEX;
  exports.SKOS = SKOS;
  exports.SKOS_XL = SKOS_XL;
  exports.TIME = TIME;
  exports.UI = UI;
  exports.UI_INRUPT = UI_INRUPT;
  exports.VANN = VANN;
  exports.VCARD = VCARD;
  exports.VCARD_INRUPT = VCARD_INRUPT;
  exports.VOID = VOID;
  exports.VS = VS;
  exports.XSD = XSD;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
