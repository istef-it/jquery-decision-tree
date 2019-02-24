(function($) {
  var settings;
  var currentCard;
  var prevCard = [];

  // Plugin definition.
  $.fn.decisionTree = function(options) {
    var elem = $(this);
    settings = $.extend({}, $.fn.decisionTree.defaults, options);

    elem.addClass(settings.containerClass);
    renderSequence(settings.data, elem, "dctree-first");

    $(".dctree-prev").on("click", function() {
      showCard(prevCard.pop(), true);
    });

    currentCard = $("#dctree-first");
    currentCard.show();
  };

  $.fn.decisionTree.defaults = {
    data: null,
    animationSpeed: "fast",
    animation: "slide-left",
    containerClass: "dc-tree",
    cardClass: "dctree-card",
    messageClass: "dctree-message",
    backMessage: "Torna indietro",
    callback: null
  };

  function _createContainer(id) {
    return $("<div></div>")
      .addClass(settings.cardClass)
      .addClass("col-xs-12")
      .attr("id", id === "start" ? "dctree-first" : id);
  }
  function _createMessage(data) {
    return $("<div></div>")
      .addClass(settings.messageClass)
      .append(data.msg);
  }
  function _appendHelp(obj, container) {
    if (typeof obj != "undefined") {
      if (obj.help !== "") {
        container.attr("title", obj.help).addClass("show-tip");
      }
    }
  }
  function _appendDecisions(id, node, container) {
    if (typeof node.decisions != "undefined") {
      var decisions = $("<div></div>")
        .addClass("dctree-decisions")
        .addClass("row");
      for (var i = 0; node.decisions.length > i; i++) {
        var decision = node.decisions[i];
        var genId = decision.next;
        var grid = $("<div></div>")
          .addClass("col-lg-6")
          .addClass("col-md-12");
        var answer = $("<div></div>")
          .addClass("dctree-answer-" + i)
          .append(decision.answer)
          .attr("data-value", decision.value || "")
          .on("click", function() {
            getNextCard(this);
          })
          .attr("data-dctree-targetid", genId)
          .addClass("btn-aster");
        _appendHelp(decision, answer);
        grid.append(answer);
        decisions.append(grid);
      }
      container.append(decisions);
    }
  }
  function renderSequence(data, elem) {
    for (var nodeID in data) {
      var nodo = data[nodeID];
      var container = _createContainer(nodeID);
      var message = _createMessage(nodo);
      container.append(message).attr("data-value", data.value || "");
      _appendHelp(nodo, message);
      _appendDecisions(nodeID, nodo, container);
      if (nodeID != "start") {
        var controls = $("<div></div>").addClass("dctree-controls col-md-12");
        controls.append(
          $(
            '<a href="javascript:;" class="dctree-prev">' +
              (settings.backMessage || "Torna indietro") +
              "</a>"
          )
        );
        container.append(controls);
      }
      elem.append(container);
    }
  }

  function getNextCard(elem) {
    var e = $(elem);
    currentCard = e.parents("." + settings.cardClass)[0];
    prevCard.push(currentCard.id);
    var nextCard = e.attr("data-dctree-targetid");
    if (settings.callback !== null) {
      // a livello di ANSWER
      settings.callback(e.data("value"));
    }
    showCard(nextCard);
  }

  function showCard(id, backward) {
    var nextCard = $("#" + id);

    if (settings.animation == "slide") {
      $(currentCard).slideUp(settings.animationSpeed, function() {
        nextCard.slideDown(settings.animationSpeed);
      });
    } else if (settings.animation == "fade") {
      $(currentCard).fadeOut(settings.animationSpeed, function() {
        nextCard.fadeIn(settings.animationSpeed);
      });
    } else if (settings.animation == "slide-left") {
      var left = { left: "-100%" };
      var card = $(currentCard);

      if (backward) {
        left = { left: "100%" };
      }
      card.animate(left, settings.animationSpeed, function() {
        card.hide();
      });

      if (nextCard.css("left") == "-100%" || nextCard.css("left") == "100%") {
        left.left = 0;
        nextCard.show().animate(left, settings.animationSpeed);
      } else {
        nextCard.fadeIn(settings.animationSpeed);
      }
    }

    currentCard = nextCard;
    if (settings.callback !== null) {
      // a livello di CARD
      settings.callback(currentCard.data("value"));
    }
  }

  // End of closure.
})(jQuery);
