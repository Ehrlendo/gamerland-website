
var FDButtons = function(){
    this.activateInput = (inp) => {
        //Get the input tag
        var el = inp.querySelector(".fd-text-input__action");
        if(!el) {return new Error("Could not find element")}

        el.addEventListener("blur", (e)=>{
            if(e.target.value.trim().length > 0) {
                //Don't let the label fall back down
                el.closest(".fd-text-input").querySelector(".fd-text-input__title").style = `transform: translate(0.5rem, calc(-50% - 1.2rem)); font-size: 0.8rem; line-height: 1rem; height: 1rem; opacity: 1; background-color: white;`; 
                return;
            }
            console.log("iasind")
            el.closest(".fd-text-input").querySelector(".fd-text-input__title").style = ``;
        })

    },
    this.textInput = (title)=> {
        var lab = document.createElement("label");
        lab.className = "fd-text-input";
    
        var inp = document.createElement("input");
        inp.type = "text";
        inp.className = "fd-text-input__action smooth-shadow";
    
        var sp = document.createElement("span");
        sp.className = "fd-text-input__title";

        if(title) {
            sp.innerHTML = title + '';
        }

        var indicator = document.createElement("div");
        indicator.className = "fd-text-input__indicator";

        lab.appendChild(inp);
        lab.appendChild(indicator);
        lab.appendChild(sp);

        return lab;
    }
}
