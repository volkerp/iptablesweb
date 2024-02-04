<script>
import { afterUpdate } from "svelte";

export let chain;


// format int size to human readable
function format_size(size) {
    if (size < 1024) {
        return size + "B";
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + "KiB";
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(1) + "MiB";
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(1) + "GiB";
    }
}

// format int count to human readable
function format_count(count) {
    if (count < 1000) {
        return count;
    } else if (count < 1000 * 1000) {
        return (count / 1000).toFixed(1) + "K";
    } else if (count < 1000 * 1000 * 1000) {
        return (count / 1000 / 1000).toFixed(1) + "M";
    } else {
        return (count / 1000 / 1000 / 1000).toFixed(1) + "G";
    }
}

function parse_rule(ruleobj) {
    const tokens = ruleobj.rule.split(" ").filter((s) => s !== "");

    const rule = {
        pkts: format_count(ruleobj.counter.packets),
        bytes: format_size(ruleobj.counter.bytes),
        target: "",
        goto: "",
        prot: "all",
        opt: "--",
        in: "any",
        out: "any",
        source: "anywhere",
        destination: "anywhere",
        fragment: false,
        matchname: " ",
        matchoptions: " ",
    };
    

    // iterate over tokens array, and build up a rule object

    let token = tokens.shift();
    while (token !== undefined) {
        let negate = ""
        if (token === "!") {
            negate = "!"
            token = tokens.shift()
        }
        if (token === "-m") {
            rule.matchname = tokens.shift()
            // consume tokens until -m or -j or end of tokens
            token = tokens.shift()
            while (token !== undefined && token !== "-m" && token !== "-j") {
                rule.matchoptions += " " + token
                token = tokens.shift()
            }
            // push back the last token
            tokens.unshift(token)
        } else if (token === "-j") {
            rule.target = tokens.shift()
        } else if (token === "-g") {
            rule.goto = tokens.shift()
        } else if (token === "-p") {
            rule.prot = negate + tokens.shift()
        } else if (token === "-i") {
            rule.in = negate + tokens.shift()
        } else if (token === "-o") {
            rule.out = negate + tokens.shift()
        } else if (token === "-s") {
            rule.source = negate + tokens.shift()
        } else if (token === "-d") {
            rule.destination = negate + tokens.shift()
        } else if (token === "-f") {
            rule.fragment = true
        } else {
            console.log("unknown token", token)
        }
        token = tokens.shift();
        negate = ""
    }


    return rule;
}

function is_builtin_chain(tablename, chainname) {
    if (tablename === "filter") {
        return chainname === "INPUT" || chainname === "FORWARD" || chainname === "OUTPUT";
    } else if (tablename === "nat") {
        return chainname === "PREROUTING" || chainname === "INPUT" || chainname === "OUTPUT" || chainname === "POSTROUTING";
    } else if (tablename === "mangle") {
        return chainname === "PREROUTING" || chainname === "INPUT" || chainname === "FORWARD" || chainname === "OUTPUT" || chainname === "POSTROUTING";
    } else {
        return false;
    }    
}



const rules = []
chain.rules.forEach((rule) => {
    const ruleobj = parse_rule(rule);
    rules.push(ruleobj);
});

const highel = {}
let cur_target = null; // current target element highlighted

$: {
    if (cur_target !== null) {
        highel[cur_target].forEach((element) => {
            element.style.backgroundColor = "rgba(245, 232, 0, 0.6)";
            element.style.transition = "background-color 0.1s ease";
        });
    } else {
        for (const [target, elements] of Object.entries(highel)) {
            elements.forEach((element) => {
                element.style.backgroundColor = "";
                element.style.transition = "background-color 0.2s ease";
            });
        }
    }
}


afterUpdate(() => {
    document.querySelectorAll('[data-target]').forEach((element) => {
        const target = element.dataset.target;
        if (target === "ACCEPT" || target === "DROP" || target === "RETURN") {
            return
        }

        highel[target] = highel[target] ? [...highel[target], element] : [element];  // store elements in lookup dict by target

        element.addEventListener('mouseenter', (event) => {
            cur_target = target
        }); 

        element.addEventListener('mouseleave', (event) => {
            if (cur_target !== null)
                cur_target = null
        });
    });

    // document.querySelectorAll('[class*="tgt-"]').forEach((element) => {
    //     // add hover event handler to element
        

    //         const tgtClass = Array.from(element.classList).find((className) => className.startsWith("tgt-"));
            
    //         console.log(tgtClass);

    //         event.target.parentNode.style.backgroundColor = "rgba(0, 255, 0, 0.4)";
    //         event.target.parentNode.style.transition = "background-color 0.25s ease";
    //     });
    //     element.addEventListener('mouseout', (event) => {
    //         event.target.parentNode.style.backgroundColor = "";
    //         event.target.parentNode.style.transition = "background-color 1.0s ease";
    //     });
        

})




// for (const [chainname, chain] of Object.entries(forward_chain)) { 
//     console.log(chainname, chain);
//     // iterate over rules in chain
//     for (const rulestring of chain) {
//         console.log("rulestring", rulestring);
//         const rule = parse_rule(rulestring);
//         console.log("rule", rule);
//     }
// }

function policy_color(target) {
    if (target === "ACCEPT") {
        return "text-lime-700";
    } else if (target === "DROP") {
        return "text-red-800";
    } else {
        return "";
    }
}

function class_for_target(target) {
    if (target === "ACCEPT") {
        return "text-lime-700";
    } else if (target === "DROP") {
        return "text-red-800";
    } else {
        return "tgt-" + target;
    }
}


</script>

<style>
.grid-table {
    display: grid;
    grid-template-columns: repeat(2, 1fr) 2fr repeat(2, 1fr) repeat(5, 2fr);
    align-items: stretch;
}

.header {
    @apply border bg-white border-stone-200 text-stone-500;
}


</style>

<div class="grid-table">
    <div class="border border-stone-200 col-span-10 bg-stone-200 text-left" data-target="{chain.name}">
        <span class="text-stone-500">{chain.builtin ? 'built-in' : 'user-defined'} chain </span>{chain.name}
    </div>
    <div class="header">pkts</div>
    <div class="header">bytes</div>
    <div class="header">target</div>
    <div class="header">prot</div>
    <div class="header">opt</div>
    <div class="header">in</div>
    <div class="header">out</div>
    <div class="header">source</div>
    <div class="header">destination</div>
    <div class="header">match</div>

    {#each rules as row, index}
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.pkts}</div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.bytes}</div>
        <div class="truncate border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}" data-target="{row.target}">
            <span class={class_for_target(row.target)}>{row.target}</span></div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.prot}</div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.opt}</div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.in}</div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.out}</div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.source}</div>
        <div class="border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.destination}</div>
        <div class="overflow-x-auto whitespace-nowrap border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.matchname} {row.matchoptions}</div>
    {/each}
    
    {#if chain.builtin}
    <div class="border border-stone-200 col-span-10 bg-stone-200 text-left"><span class="text-stone-500">Policy <span class={policy_color(chain.policy)}>{chain.policy}</span></div>    
    {/if}



</div>