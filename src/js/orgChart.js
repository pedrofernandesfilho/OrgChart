;(function(doc) {
  // ctor
  this.OrgChart = function(data, options) {
    // Public Properties
    this.data = null;
    this.options = null;
    this.rootElement = null;

    // Options
    this.options = extend({
        rootElementId: null
      , visibleUpToLevel: 4
    }, options);

    // Init
    _init.call(this, data);
  } // ctor


  // Public methods


  // Private methods
  function _init(data) {
    this.data = data;
    this.rootElement = this.options.rootElementId ? doc.getElementById(this.options.rootElementId) : doc.body;

    // Build OrgChart
    buildOrgChart.call(this, data, this.options.visibleUpToLevel, this.rootElement);
  }

  function buildOrgChart(data, visibleUntil, rootElement) {
    var a = document.createElement("a")
      , span = document.createElement("span")
      , li = document.createElement("li")
      , df = document.createDocumentFragment();

    a.appendChild(document.createTextNode(data.position));
    a.appendChild(document.createElement("br"));
    span.appendChild(document.createTextNode(data.name));
    a.appendChild(span);
    li.appendChild(a);

    buildOrgChartItems(li, data.subordinates, --visibleUntil);

    if (rootElement.tagName == "ul")
      df.appendChild(li);
    else {
      var ul = document.createElement("ul");
      ul.appendChild(li);
      df.appendChild(ul);
    }

    rootElement.appendChild(df);
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

/*(function() {
  var treeElement = document.getElementById("tree");
  buildTree(treeElement, dataTreeJson, 4);
  adjustWidth(treeElement);
  adjustHeight(treeElement);
})();*/


function buildTreeSubItems(rootElement, items, amountVisible) {
  if (items == null) return;
  if (items.length == 0) return;

  var ul = document.createElement("ul")
    , a, span, li, expand;

  if (amountVisible == 0)
    ul.className = "hide";
  else
    amountVisible--;
  
  rootElement.appendChild(ul);

  for(var i in items) {
    a = document.createElement("a")
    span = document.createElement("span")
    li = document.createElement("li")

    a.appendChild(document.createTextNode(items[i].position));
    a.appendChild(document.createElement("br"));
    span.appendChild(document.createTextNode(items[i].name));
    a.appendChild(span);
    li.appendChild(a);

    // TODO: Create expand button
    if (amountVisible == 0) {
      expand = document.createElement("div");
      expand.appendChild(document.createTextNode("[+]"));
      expand.onclick = expandOnClick;
      li.appendChild(expand);
    }

    ul.appendChild(li);

    buildTreeSubItems(li, items[i].subordinates, amountVisible);
  }
}

function adjustWidth() {
  var treeElement = document.getElementById("tree");

  treeElement.style.width = "100000px";
  
  var widths = [];
  
  $(treeElement).find("ul").not(".hide").each(function() {
    widths.push($(this).width());
  });
  
  widths.sort(function(a, b) { return b - a; });

  treeElement.style.width = widths[1] + "px";
}

function adjustHeight(treeElement) {
  var heights = [];

  var as = treeElement.getElementsByTagName("a");
  
  for (var i in as) heights.push(as[i].clientHeight);

  heights.sort(function(a, b) { return b - a; });

  for (var i = 0; i < as.length; i++)
    as[i].style.height = (heights[0]-10) + "px";
}

function expandOnClick(e) {
  //alert("expandOnClick " + e);
  console.log(e);
  console.log(this);

  this.style.background = "#f00";

  console.log(this.parentElement);
  console.log(this.parentElement.getElementsByTagName("ul"));
  this.parentElement.getElementsByTagName("ul")[0].className = "";

  this.contentText = "[-]";

  adjustWidth();
}
