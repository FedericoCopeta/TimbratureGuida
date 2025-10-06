async function loadGuida() {
  const response = await fetch("guida_tree.json");
  const data = await response.json();
  buildTree(data, document.getElementById("treeContainer"));
}

function buildTree(data, container, path = []) {
  container.innerHTML = "";
  const ul = document.createElement("ul");
  ul.style.listStyleType = "none";
  ul.style.paddingLeft = "16px";

  for (const key in data) {
    const li = document.createElement("li");
    li.style.marginBottom = "4px";

    const span = document.createElement("span");
    span.textContent = key;
    span.style.cursor = "pointer";
    span.style.display = "inline-block";
    span.style.padding = "4px";
    span.onmouseover = () => span.style.backgroundColor = "#eaeaea";
    span.onmouseout = () => span.style.backgroundColor = "";

    const currentPath = [...path, key];

    if (typeof data[key] === "string") {
      span.onclick = () => {
        document.getElementById("contentContainer").innerHTML = "<h3>" + key + "</h3><p>" + data[key] + "</p>";
      };
    } else {
      const toggle = document.createElement("span");
      toggle.textContent = "▸ ";
      toggle.style.cursor = "pointer";
      toggle.style.marginRight = "4px";

      const childContainer = document.createElement("div");
      childContainer.style.display = "none";
      childContainer.style.marginLeft = "12px";

      toggle.onclick = () => {
        if (childContainer.style.display === "none") {
          childContainer.style.display = "block";
          toggle.textContent = "▾ ";
        } else {
          childContainer.style.display = "none";
          toggle.textContent = "▸ ";
        }
      };

      li.appendChild(toggle);
      span.onclick = toggle.onclick;
      li.appendChild(span);
      li.appendChild(childContainer);
      buildTree(data[key], childContainer, currentPath);
    }

    ul.appendChild(li);
  }

  container.appendChild(ul);
}

document.getElementById("searchBox").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const content = document.getElementById("contentContainer");
  if (!query) {
    content.innerHTML = "";
    loadGuida();
    return;
  }

  fetch("guida_tree.json")
    .then(res => res.json())
    .then(data => {
      const results = [];
      function search(obj, path = []) {
        for (const key in obj) {
          const value = obj[key];
          if (typeof value === "string" && (key.toLowerCase().includes(query) || value.toLowerCase().includes(query))) {
            results.push({ title: key, content: value });
          } else if (typeof value === "object") {
            search(value, [...path, key]);
          }
        }
      }
      search(data);
      if (results.length > 0) {
        content.innerHTML = results.map(r => "<h3>" + r.title + "</h3><p>" + r.content + "</p>").join("<hr/>");
      } else {
        content.innerHTML = "<p>Nessun risultato trovato.</p>";
      }
    });
});

loadGuida();
