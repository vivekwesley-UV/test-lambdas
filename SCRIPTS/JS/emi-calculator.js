
// const p = 299000; // Principal loan amount
// const N = 60; // no of EMIs
// const r = 9.99; //  = 9.99% // annual rate of interest
// const R = r / 12 / 100; // R = Annual Rate of Interest/12/100
// const P = ((p * 80) / 100); // 80% of [p] -> excluded down payment from [p]

// p = principle
// N = tenure
// r = annualRateOfIterest
// R = monthlyRateOfInterest
// DP = downPaymentPercentage - 20%
// P = p - DP

// explicitly subtracting down payment
// const DP = ((p * 20) / 100); // 20% of [p]
// const P = p - DP;
// 20% of 299000 is -> 59800

const calculateMonthlyEmi = (principle, tenure, annualRateOfIterest, downPaymentPercentage ) => {    
    if(!downPaymentPercentage) downPaymentPercentage = 20;
    const downPayment = ((principle * downPaymentPercentage) / 100);
    principle = principle - downPayment;
    const monthlyRateOfInterest = annualRateOfIterest / 12 / 100;
    const EMI = ((principle * monthlyRateOfInterest ) * ((1 + monthlyRateOfInterest) ** tenure)) / (((1 + monthlyRateOfInterest) ** tenure) - 1);
    return EMI.toFixed(2);
}

console.log("EMI: ", calculateMonthlyEmi(299000, 60, 9.99, 20));