// Generated by CoffeeScript 1.6.3
(function() {
  var exports, isFunction, pass, toString;

  toString = {}.toString;

  isFunction = function(obj) {
    return toString.call(obj) === '[object Function]';
  };

  exports = module.exports = pass = function(ast, options) {
    var alternative, alternativeIndex, alternatives, initializer, myOptions, newValue, newValueIsArray, overrideInitializer, overrideRules, rule, ruleIndex, ruleName, rules, _i, _j, _len, _len1;
    myOptions = options.overrideActionPlugin;
    initializer = ast.initializer;
    overrideInitializer = myOptions.initializer;
    rules = ast.rules;
    overrideRules = myOptions.rules || {};
    if (overrideInitializer) {
      if (isFunction(overrideInitializer)) {
        overrideInitializer = exports.funToString(overrideInitializer);
      }
      ast.initializer = {
        type: 'initializer',
        code: overrideInitializer
      };
    }
    if (isFunction(overrideRules)) {
      return overrideRules(ast, options);
    }
    for (ruleIndex = _i = 0, _len = rules.length; _i < _len; ruleIndex = ++_i) {
      rule = rules[ruleIndex];
      newValue = overrideRules[rule.name];
      newValueIsArray = Array.isArray(newValue);
      if (newValue == null) {
        continue;
      }
      ruleName = rule.name;
      if (rule.expression.type === 'named') {
        rule = rule.expression;
      }
      if (newValueIsArray && rule.expression.type === 'choice') {
        alternatives = rule.expression.alternatives;
        if (alternatives.length !== newValue.length) {
          throw new Error("Rule " + ruleName + " mismatch (alternatives " + alternatives.length + " != " + newValue.length);
        }
        for (alternativeIndex = _j = 0, _len1 = alternatives.length; _j < _len1; alternativeIndex = ++_j) {
          alternative = alternatives[alternativeIndex];
          alternatives[alternativeIndex] = exports.overrideAction(alternative, newValue[alternativeIndex]);
        }
      } else if (!newValueIsArray) {
        rule.expression = exports.overrideAction(rule.expression, newValue);
      } else {
        throw new Error("Rule " + ruleName + " mismatch (needs no alternatives)");
      }
    }
    return ast;
  };

  exports.use = function(config, options) {
    var stage;
    if (options == null) {
      options = {};
    }
    if (options.overrideActionPlugin == null) {
      throw new Error('Please define overrideActionPlugin as an option to PEGjs');
    }
    stage = config.passes.transform;
    return stage.unshift(pass);
  };

  exports.funToString = function(fun) {
    var bodyEnds, bodyStarts;
    fun = fun.toString();
    bodyStarts = fun.indexOf('{') + 1;
    bodyEnds = fun.lastIndexOf('}');
    return fun.substring(bodyStarts, bodyEnds);
  };

  exports.action$ = function() {
    var join, recursiveJoin;
    join = function(arr) {
      return arr.join('');
    };
    recursiveJoin = function(value) {
      if (Array.isArray(value)) {
        value = value.map(recursiveJoin);
        value = join(value);
      }
      return value;
    };
    return recursiveJoin(__result);
  };

  exports.actionIgnore = function() {
    return '';
  };

  exports.overrideAction = function(rule, code) {
    if (isFunction(code)) {
      code = exports.funToString(code);
    }
    if (code === '__$__') {
      code = exports.action$;
    }
    if (code === '__ignore__') {
      code = exports.actionIgnore;
    }
    if (code === void 0) {
      return rule;
    }
    if (rule.type !== 'action') {
      rule = {
        type: 'action',
        expression: rule
      };
    }
    rule.code = code;
    return rule;
  };

}).call(this);
