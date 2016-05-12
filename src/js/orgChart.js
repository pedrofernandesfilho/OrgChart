/* OrgChart
 * 
 * By Pedro Fernandes Filho
 * License: MIT
 *
 * http://github.com/pedrofernandesfilho/OrgChart
 */

;(function(doc) {
  // ctor
  this.OrgChart = function(data, options) {
    // Public Properties
    this.data = null;
    this.options = null;
    this.rootElementChart = null;
    this.wrapperElementChart = null;

    // Options
    this.options = extend({
        wrapperElementId: null
      , visibleUpToLevel: 4
    }, options);

    // Init
    init.call(this, data);
  } // ctor


  // Private methods
  function init(data) {
    this.data = data;
    this.rootElementChart = doc.createElement("div");
    this.wrapperElementChart = this.options.wrapperElementId ? doc.getElementById(this.options.wrapperElementId) : doc.body;

    buildOrgChart.call(this, data, this.options.visibleUpToLevel, this.rootElementChart, this.wrapperElementChart);
    adjustRootWidth.call(this, this.rootElementChart);
    //adjustItemsHeight.call(this, this.rootElementChart);
  }

  function buildOrgChart(data, visibleUntil, rootElement, wrapperElement) {
    var a = doc.createElement("a")
      , span = doc.createElement("span")
      , li = doc.createElement("li")
      , df = doc.createDocumentFragment();

    a.appendChild(doc.createTextNode(data.position));
    a.appendChild(doc.createElement("br"));
    span.appendChild(doc.createTextNode(data.name));
    a.appendChild(span);
    li.appendChild(a);

    buildOrgChartItems.call(this, li, data.subordinates, --visibleUntil);

    if (rootElement.tagName == "ul")
      df.appendChild(li);
    else {
      var ul = doc.createElement("ul");
      ul.appendChild(li);
      df.appendChild(ul);
    }

    if (rootElement.className) rootElement.className+= " tree"; else rootElement.className = "tree";
    rootElement.appendChild(df);
    wrapperElement.appendChild(rootElement);
  }

  function buildOrgChartItems(rootElement, items, amountVisible) {
    if (items == null) return;
    if (items.length == 0) return;

    var ul = doc.createElement("ul")
      , a, span, li, expand, img;

    if (amountVisible == 0)
      ul.className = "hide";
    else
      amountVisible--;
    
    rootElement.appendChild(ul);

    for(var i in items) {
      a = doc.createElement("a")
      span = doc.createElement("span")
      li = doc.createElement("li")

      a.appendChild(doc.createTextNode(items[i].position));
      a.appendChild(doc.createElement("br"));
      span.appendChild(doc.createTextNode(items[i].name));
      a.appendChild(span);
      li.appendChild(a);

      if ((amountVisible == 0) && (items[i].subordinates.length > 0)) {
        img = doc.createElement("img");
        img.src = "imgs/plus.gif";
        expand = doc.createElement("div");
        expand.appendChild(img);
        expand.onclick = expandOnClick.bind(this, expand);
        li.appendChild(expand);
      }

      ul.appendChild(li);

      if (items[i].subordinates.length > 0)
        buildOrgChartItems.call(this, li, items[i].subordinates, amountVisible);
    }
  }

  function adjustRootWidth(rootElement) {
    rootElement.style.width = "100000px";
    
    var widths = [];
    
    // TODO: Rewrite without jQuery
    $(rootElement).find("ul").not(".hide").each(function() {
      widths.push($(this).width());
    });
    
    widths.sort(function(a, b) { return b - a; });

    rootElement.style.width = widths[1] + "px";
  }

  function adjustItemsHeight(rootElement) {
    var heights = [];
    var as = rootElement.getElementsByTagName("a");
    
    for (var i in as)
      if (as.hasOwnProperty(i))
        heights.push(as[i].clientHeight);

    heights.sort(function(a, b) { return b - a; });

    for (var i = 0; i < as.length; i++)
      as[i].style.height = (heights[0]-10) + "px";
  }

  function expandOnClick(source, event) {
    if (source.getAttribute("data-expanded") == "true") {
      source.parentElement.getElementsByTagName("ul")[0].className = "hide";
      source.getElementsByTagName("img")[0].src = "imgs/plus.gif";
      source.setAttribute("data-expanded", "false");
    } else {
      source.parentElement.getElementsByTagName("ul")[0].className = "";
      source.getElementsByTagName("img")[0].src = "imgs/minus.gif";
      source.setAttribute("data-expanded", "true");
    }
    
    adjustRootWidth.call(this, this.rootElementChart);
    centerOnScreen.call(this, source);
  }

  function centerOnScreen(element) {
    var prevSiblingRect = element.previousElementSibling.getBoundingClientRect();
    var elementScroll = this.wrapperElementChart == doc.body ? this.wrapperElementChart : this.wrapperElementChart.parentElement;

    elementScroll.scrollTop = prevSiblingRect.top;
    elementScroll.scrollLeft = prevSiblingRect.left + elementScroll.scrollLeft - (elementScroll.offsetWidth - prevSiblingRect.width) / 2;
  }

  // Useful private methods
  function extend(target, source) {
    if ((source) && (typeof source === "object"))
      for (var property in source) 
        if (source.hasOwnProperty(property))
          target[property] = source[property];

    return target;
  }
}(document));
