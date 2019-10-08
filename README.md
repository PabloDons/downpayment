# Downpayment
A tool for creating a downpayment plan for a loan based on 2 out of the 3 variables **loan length**, **monthly total**, and **total effective interest**

Written in nodejs and is based on Stacc's fintech problem

## Plan based on loan length
This is the most common way of calculating a downpayment plan for a loan. The bank often has you specify for how long you want your loan to last.

You can use the function `planFraLengde(nMonths, interest, amount, fee, startYear)` to get this information.

## Plan based on monthly total
This in particular has been the motivation for this project. What if you don't care how long it takes, but the monthly payment is the most important factor in your decision? The more you pay per month, the faster the loan will be payed back.

People will often choose the downpayment plan where you pay a monthly total where a smaller and smaller amount of it goes to the interest.

![Annuitetslån](https://finanssans.no/assets/images/annuitetslan_160215_121032.png)

If you consider the same amount of time, a serial loan will have a smaller total effective interest. You'll essentially pay less

![Serielån](https://finanssans.no/assets/images/serielan2_160215_121135.png)

You will however pay much more in the beginning, which some people can't affort. However if you know how much you can budget each month for the loan and want to get it overwith as fast as possible, you will need to do either some trial and error, or some math. This is what this downpayment plan aims to do.

You can use the function `planFraManedsbelop(P, amount, interest, fee, startYear)` where P is the monthly total

## Plan based on total effective interest
**WIP**
If you want to design a plan based on how much interest you are willing to pay, this is meant to calculate this. It turned out to be an extremely demanding problem and I was unable to finish it. Even though it isn't very useful, as most people will use the two other functions to minimize this since they will often have limitations on this specifically. However as most mathematicians would say, even if the result itself isn't directly useful, the findings and work I have done will surely be useful in the bigger picture.

I had found a function to calculate the the total effective interest from the length of the loan in months **x**:

![r=\frac{1}{1+\frac{interest}{12}}](https://latex.codecogs.com/svg.latex?r%3D%5Cfrac%7B1%7D%7B1&plus;%5Cfrac%7Binterest%7D%7B12%7D%7D)

![f(x)=1-\frac{amount}{(\frac{(1-r)amount}{r-r^{x+1}}+fee)x}](https://latex.codecogs.com/svg.latex?f%28x%29%3D1-%5Cfrac%7Bamount%7D%7B%28%5Cfrac%7B%281-r%29amount%7D%7Br-r%5E%7Bx&plus;1%7D%7D&plus;fee%29x%7D)

In order to get the number of months from this function, I had to invert it. This proved to be a matter of advanced calculus and function analytics. I found eventually that this function was very similar to a reverse-polynomial and had two asymptotes. I also observedthat it was a one-to-one function and that a reverse existed. At that point I started running out of time and eventually gave up, but in the future, I'd like to revisit this. I will most likely ask experts for help in resolving this, or look for another way to calculate this, but for now it will stay a work in progress.
