let button_header = document.getElementById("menu-button");
let menu = document.getElementById("menu");
let sectionResult = document.getElementById("section-result");

let visible = false;
const autorun = () => {
  let items = localStorage.getItem("items");
  if (items) {
    let parse = JSON.parse(items);
    initializar(parse, sectionResult);
  }
};
autorun();
function copy(c, id) {
  let button = document.getElementById(id);
  navigator.clipboard.writeText(c);
  button.innerHTML = "Copied!";
  button.style.backgroundColor = "var(--DarkViolet)";
}
button_header.addEventListener("click", function () {
  if (visible) {
    menu.style.display = "none";
    visible = !visible;
  } else {
    visible = !visible;
    menu.style.display = "block";
  }
});
function handleSubmit(e) {
  e.preventDefault();
  let input = document.getElementById("input-link");
  let labelError = document.getElementById("label-error");
  if (input.value === "") {
    labelError.style.display = "block";
    input.className += " error-input";
  } else {
    labelError.style.display = "none";
    input.className = input.className.split(" ")[0];
    let valor = input.value;
    console.log(JSON.stringify(valor));
    let data = {
      url: valor.trim(),
    };
    fetch("https://rel.ink/api/links/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((r) => {
            let resdata = {
              hashid: r.hashid,
              valor,
            };
            let items = localStorage.getItem("items");
            if (items) {
              let parse = JSON.parse(items);
              parse.push(resdata);
              localStorage.setItem("items", [JSON.stringify(parse)]);
            } else {
              let array = [];
              array.push(resdata);
              localStorage.setItem("items", [JSON.stringify(array)]);
            }
            let newelement = createElement(resdata);
            sectionResult.appendChild(newelement);
          });
        } else {
          console.log(res.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
function initializar(dataArray, sectionResult) {
  dataArray.map((o) => {
    sectionResult.appendChild(createElement(o));
  });
}
function createElement(data) {
  let container = document.createElement("div");
  container.className = "result__content";
  let label = document.createElement("label");
  label.className = "result__content-label";
  label.innerHTML = `${data.valor}`;
  let hr = document.createElement("hr");
  hr.className = "result__content-hr";
  let a = document.createElement("a");
  a.className = "result__content-a";
  a.href = `https://rel.ink/${data.hashid}`;
  a.innerHTML = `https://rel.ink/${data.hashid}`;
  let buttonContainer = document.createElement("div");
  buttonContainer.className = "result__button";
  let button = document.createElement("button");
  button.setAttribute(
    "onclick",
    `copy("https://rel.ink/${data.hashid}" , "${data.hashid}")`
  );
  button.id = data.hashid;
  buttonContainer.appendChild(button);
  button.className = "button-2";
  button.innerHTML = "Copy";
  container.appendChild(label);
  container.appendChild(hr);
  container.appendChild(a);
  container.appendChild(buttonContainer);

  return container;
}
