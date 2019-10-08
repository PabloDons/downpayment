// const payload = {
//     "laanebelop": 2000000,
//     "nominellRente": 3,
//     "terminGebyr": 30,
//     "utlopsDato": "2045-01-01",
//     "saldoDato": "2020-01-01",
//     "datoForsteInnbetaling": "2020-02-01",
//     "ukjentVerdi": "TERMINBELOP"
// }

// L = loan amount
// n = number of months of down-payment
// P = monthly amount
// i = monthly interest = annual interest ÷ 12

// One month: L(1+i)-P = 0
// Two months: (L(1+i)-P)(1+i)-P = 0
//           P/(1+i) + P/(1+i)^2 = L
// Many months: P * SUM[1/(1+i)^k, k=1->n] = L
// where r = 1/(1+i)
// Geometric sum: S_n = r^1 + r^2 + ... + r^n
//                S_n = (r-r^(n+1))/(1-r)
// Then: P * S_n = L
//    => P = L / S_n

/*
const r = 1/(1+(0.03/12))
const P = payload.laanebelop / ((r - Math.pow(r, (12*25) + 1)) / (1 - r))
var sum = 0
var rest = payload.laanebelop
for (var i=1; i<12*25+1; i++) {
    sum += P/Math.pow(1+(0.03/12), i)

    rest -= P-(rest*0.03/12)
}

// Demonstration of correctness
console.log("Terminbeløp")
console.log(P)

console.log("sum of repayed amount excluding interests:")
console.log(sum)

console.log("Rest of loan after removing repayed amount and taking interest")
console.log(rest)

console.log("Interest from first installment. Also the last term in the geometric series:")
console.log(P / Math.pow(1 + (0.03 / 12), 12*25))
*/

function planFraLengde(nMonths, interest, amount, fee, startYear) {
    // Assuming monthly payments
    const r = 1 / (1 + (interest / 12))
    const P = amount / ((r - Math.pow(r, nMonths + 1)) / (1 - r))
    
    planFraManedsbelop(P, amount, interest, fee, startYear)
}

function planFraEffektivRente(effectiveInterest, interest, amount, fee, startYear) {
    // Plan is to reverse this procedure so that nMonths is calculated from effectiveInterest
    // At least I ish-proved it was possible by showing it was a reverse-polynomial and for every x there was one and only one y
    nMonths = 15 // arbitrary

    const r = 1 / (1 + (interest / 12))
    const P = amount * (1 - r) / (r - Math.pow(r, nMonths + 1))

    const sum = (P + fee) * nMonths
    const effectiveInterest = 1 - (amount / sum)


    return planFraLengde(nMonths, interest, amount, fee,startYear)
}

function planFraManedsbelop(P, amount, interest, fee, startYear) {
    P -= fee
    startYear = parseInt(startYear)


    const plan = { nedbetalingsplan: { innbetalinger: [] } }
    
    plan.nedbetalingsplan.innbetalinger.push({
        restgjeld: amount,
        dato: startYear + "-01-01",
        innbetaling: 0.0,
        gebyr: 0.0,
        retner: 0.0,
        total: 0.0
    })

    plan.effektivrente = { sum: 0 }
    var restAmount = amount
    var i
    for (i = 0; restAmount > 0.01; i++) { // margin of error of 1%
        avdrag = P - (restAmount * (interest / 12))
        if (avdrag >= restAmount) {
            avdrag = restAmount
            P = restAmount + restAmount * (interest / 12)
        }
        restAmount -= avdrag
        plan.effektivrente.sum += P + fee
        

        plan.nedbetalingsplan.innbetalinger.push({
            restgjeld: restAmount,
            dato: startYear + Math.floor((i + 1) / 12) + "-" + numFormat((i + 1) % 12 + 1) + "-01",
            innbetaling: avdrag,
            gebyr: fee,
            renter: P - avdrag,
            total: P + fee
        })
    }

    plan.effektivrente.andel = 1 - (amount / plan.effektivrente.sum)

    return plan
}

function numFormat(n) {
    return n > 9 ? "" + n : "0" + n;
}

console.log(JSON.stringify(planFraManedsbelop(10000,2000000,0.03,30,2020)))