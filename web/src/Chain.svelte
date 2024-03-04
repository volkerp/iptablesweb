<script>
import { afterUpdate } from "svelte";
import { Tooltip } from 'flowbite-svelte'

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
        comment: ruleobj.comment?.comment
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
            while (token !== undefined && token !== "-m" && token !== "-j" && token !== "-g") {
                rule.matchoptions += " " + token
                token = tokens.shift()
            }
            // push back the last token
            tokens.unshift(token)
        } else if (token === "-j") {
            rule.target = tokens.shift()

            if (rule.target === "MARK" || rule.target === "HMARK" || rule.target === "CONNMARK" || rule.target === "NFQUEUE" || rule.target === "ULOG" || rule.target === "MASQUERADE" || rule.target === "SNAT" || rule.target === "DNAT" || rule.target === "REDIRECT" || rule.target === "REJECT" || rule.target === "LOG" || rule.target === "DSCP" || rule.target === "TOS" || rule.target === "CLASSIFY" || rule.target === "TCPMSS" || rule.target === "TPROXY" || rule.target === "NETMAP" || rule.target === "SAME" || rule.target === "SET" || rule.target === "SECMARK" || rule.target === "NAT" || rule.target === "MIRROR" || rule.target === "TARPIT" || rule.target === "NOTRACK" || rule.target === "MASQUERADE" || rule.target === "SNAT" || rule.target === "DNAT" || rule.target === "REDIRECT" || rule.target === "REJECT" || rule.target === "LOG" || rule.target === "DSCP" || rule.target === "TOS" || rule.target === "CLASSIFY" || rule.target === "TCPMSS" || rule.target === "TPROXY" || rule.target === "NETMAP" || rule.target === "SAME" || rule.target === "SET" || rule.target === "SECMARK" || rule.target === "NAT" || rule.target === "MIRROR" || rule.target === "TARPIT" || rule.target === "NOTRACK" || rule.target === "MASQUERADE" || rule.target === "SNAT" || rule.target === "DNAT" || rule.target === "REDIRECT" || rule.target === "REJECT" || rule.target === "LOG" || rule.target === "DSCP" || rule.target === "TOS" || rule.target === "CLASSIFY" || rule.target === "TCPMSS" || rule.target === "TPROXY" || rule.target === "NETMAP" || rule.target === "SAME" || rule.target === "SET" || rule.target === "SECMARK" || rule.target === "NAT" || rule.target === "MIRROR" || rule.target === "TARPIT" || rule.target === "NOTRACK" || rule.target === "MASQUADE") {
                rule.matchoptions = tokens.splice(0, tokens.length).join(" ")  // consume rest of tokens
            }
        } else if (token === "-g") {
            rule.target = tokens.shift()
            //rule.goto = tokens.shift()
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
            element.style.backgroundColor = "rgba(227, 250, 0, 0.66)";
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
        if (target === "ACCEPT" || target === "DROP" || target === "RETURN" || target === "REJECT" || target === "") {
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
    } else if (target === "DROP" || target === "REJECT") {
        return "text-red-800";
    } else {
        return "";
    }
}

function class_for_target(target) {
    if (target === "ACCEPT") {
        return "text-lime-700";
    } else if (target === "DROP" || target === "REJECT") {
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

.mytooltip {
    @apply p-4 text-lg font-medium bg-purple-500 text-gray-100;
}

:global(.tooltip) {
		/* white-space: nowrap; */
		position: relative;
		/* padding-top: 0.35rem; */
		/* cursor: zoom-in; */
	}
	
	/* :global(.tooltip::after) {
		margin: 0 0.15rem 0 0.25rem;
		content: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="-50 -50 100 100"%3E%3Cg fill="none" stroke="hsl(0, 0%25, 30%25)" stroke-linecap="round"%3E%3Cpath stroke-width="8" d="M -13 -13 m 0 -10 v 20 m 10 -10 h -20" /%3E%3Cg stroke-width="14"%3E%3Ccircle r="30" cx="-13" cy="-13" /%3E%3Cpath d="M 24 24 l 18 18" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
	} */
	
	:global(#tooltip) {
		position: absolute;
		bottom: 100%;
		right: 0.78rem;
		transform: translate(50%, 0);
		padding: 0.2rem 0.35rem;
		background: hsl(0, 0%, 20%);
		color: hsl(0, 0%, 98%);
		font-size: 0.95em;
		border-radius: 0.25rem;
		filter: drop-shadow(0 2px 2px hsla(0, 0%, 0%, 0.2));
        white-space: normal;      
        max-width: 240px;
        width: 240px;
	}
	
	:global(.tooltip:not(:focus) #tooltip::before) {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0.6em;
		height: 0.25em;
		background: inherit;
		clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
	}
</style>

<div class="grid-table">
    <div class="border border-stone-200 col-span-10 bg-stone-200 text-left" data-target="{chain.name}">
        <span class="text-stone-500">{chain.builtin ? 'built-in' : 'user-defined'} chain </span>{chain.name} 
    </div>
    <div class="header">pkts</div>
    <div class="header">bytes</div>
    <div class="header" id="header_target">target</div>
    <div class="header" id="header_prot">prot</div>
    <div class="header">opt</div>
    <div class="header" id="header_in">in</div>
    <div class="header" id="header_out">out</div>
    <div class="header" id="header_source">source</div>
    <div class="header" id="header_dest">destination</div>
    <div class="header">match</div>
    <Tooltip triggeredBy="#header_target" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">
        A firewall rule specifies criteria for a packet and a target.  If the packet does not match, the next rule in the chain is examined; if it does match, then the next rule is specified by the value of the target, which can be the name of a user-defined chain, one of the targets described in iptables-extensions(8), or one of the special values ACCEPT, DROP or RETURN.<br>
        ACCEPT means to let the packet through.  DROP means to drop the packet on the floor.  RETURN means stop traversing this chain and resume at the next rule in the previous (calling)  chain.   If  the  end  of  a
       built-in chain is reached or a rule in a built-in chain with target RETURN is matched, the target specified by the chain policy determines the fate of the packet.
    </Tooltip>
    <Tooltip triggeredBy="#header_prot" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">The protocol of the rule or of the packet to check. The specified protocol can be one of tcp, udp, udplite, icmp, icmpv6, esp, ah, sctp, mh or the special keyword 'all' which matches all protocols.</Tooltip>
    <Tooltip triggeredBy="#header_in" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">
        Name of an interface via which a packet was received (only for packets entering the INPUT, FORWARD and PREROUTING chains).  When the "!" argument  is  used  before  the  interface  name,
        the sense is inverted. If the interface name ends in a "+", then any interface which begins with this name will match.
    </Tooltip>
    <Tooltip triggeredBy="#header_out" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">
        Name of an interface via which a packet is going to be sent (for packets entering the FORWARD, OUTPUT and POSTROUTING chains). When the "!" argument is used before the interface name, 
        the sense is inverted. If the interface name ends in a "+", then any interface which begins with this name will match.
    </Tooltip>
    <Tooltip triggeredBy="#header_source" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">
        The source address of the rule. This can either be a host name, a network IP address (with /mask), or a plain IP address. 
        The mask can be either a network mask or a plain number, specifying the number of 1's at the left side of the network mask. 
        Thus, a mask of 24 is equivalent to 255.255.255.0.  A '!' argument before the address specification inverts the sense of the address.
    </Tooltip>
    <Tooltip triggeredBy="#header_dest" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">
        The destination address of the rule. This can either be a host name, a network IP address (with /mask), or a plain IP address. 
        The mask can be either a network mask or a plain number, specifying the number of 1's at the left side of the network mask. 
        Thus, a mask of 24 is equivalent to 255.255.255.0.  A '!' argument before the address specification inverts the sense of the address.
    </Tooltip>

    {#each rules as row, index}
        {#if row.comment}
        <div class="col-span-10 text-left {index % 2 === 1 ? 'bg-stone-100' : ''}"><span class="text-stone-500">comment: </span>{row.comment}</div>
        {/if}
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
        <div class="overflow-x-auto whitespace-nowrap text-left border-b border-stone-300 {index % 2 === 1 ? 'bg-stone-100' : ''}">{row.matchname} {row.matchoptions}</div>
    {/each}
    
    {#if chain.builtin}
    <div class="border border-stone-200 col-span-10 bg-stone-200 text-left">
        <span class="text-stone-500" id="footer_policy">Policy <span class={policy_color(chain.policy)}>{chain.policy}</span>
    </div>
    <Tooltip triggeredBy="#footer_policy" type="custom" defaultClass="" class="border border-stone-300 p-2 text-left bg-stone-100 max-w-prose">If the end of a built-in chain is reached or a rule in a built-in chain with target RETURN is matched, the target specified by the chain policy determines the fate of the packet.</Tooltip>
    {/if}



</div>