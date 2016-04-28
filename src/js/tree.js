(function() {
  var treeElement = document.getElementById("tree");
  buildTree(treeElement, dataTreeJson, 7);
  adjustWidth(treeElement);
})();

function buildTree(rootElement, data, visibleUntil) {
  var a = document.createElement("a")
    , span = document.createElement("span")
    , li = document.createElement("li");

  a.appendChild(document.createTextNode(data.position));
  a.appendChild(document.createElement("br"));
  span.appendChild(document.createTextNode(data.name));
  a.appendChild(span);
  li.appendChild(a);

  if (rootElement.tagName == "ul")
    rootElement.appendChild(li);
  else {
    var ul = document.createElement("ul");
    ul.appendChild(li);
    rootElement.appendChild(ul);
  }

  buildTreeSubItems(li, data.subordinates, --visibleUntil);
}

function buildTreeSubItems(rootElement, items, amountVisible) {
  if (items == null) return;
  if (items.length == 0) return;

  var ul = document.createElement("ul")
    , a, span, li;

  // TODO: Create expand button
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

    ul.appendChild(li);

    buildTreeSubItems(li, items[i].subordinates, amountVisible);
  }
}

function adjustWidth(treeElement) {
  treeElement.style.width = "100000px";
  
  var widths = [];
  
  $(treeElement).find("ul").not(".hide").each(function() {
    widths.push($(this).width());
  });
  
  widths.sort(function(a, b) { return b - a; });

  treeElement.style.width = widths[1] + "px";
}
