window.addEventListener("load",  main);

//global variables
let totalCost = 0, costMultiplier = 1, totalWeight = 0, totalGal = 0;
let sweetnessVal = 0, tanginessVal = 0, qualityVal = 0, processingVal = 0, fermentationVal = 0, siteVal = 0, pasteurizationVal = 100;

//constantly running functions
function main()
{
    appleCount();
    appleQuality();
    appleProcessing();
    appleFermentation();
    appleSite();
    applePasteurization();
    update();
    let submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", loadCurator());
}

//continuously updates the top-right floating div
function update()
{
    document.getElementById("totalCost").innerHTML = `${(totalCost*costMultiplier).toFixed(2)}`;
    document.getElementById("totalWeight").innerHTML = `${totalWeight.toFixed(2)}`;
    document.getElementById("totalGallons").innerHTML = `${totalGal.toFixed(2)}`;
}

//works on the apple quantities
function appleCount()
{
    let quantityApples = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // array of apple quantities 
    const appleCosts = [2.27, 1.47, 1.67, 1.50, 1.47, 1.97, 2.27, 1.26, 1.26]; //array of cost multipliers
    const sweetnessVals = [1, 1, 0.8, 0.6, 0.5, 0.4, 0.2, 0.4, 0.2]; // array of sweetness multipliers
    const tanginessVals = [0.2, 0.2, 0.4, 0.4, 0.5, 1, 0.8, 0.4, 0.7]; // array of tanginess/acidity multipliers

    const appleInputs = document.getElementsByClassName("appleInput");
    for( let i = 0; i < appleInputs.length; i++) 
    {
        appleInputs[i].addEventListener("input", function() //each time an input is made on any of the apple quntity inputs, do the follwing
        {
            quantityApples[i] = Math.abs(Number(appleInputs[i].value)); //set array val
            totalWeight = quantityApples.reduce(function(total, quantity) //calculate total weight
            {
                return total + quantity;
            }, 0);
            totalCost = 0, sweetnessVal = 0, tanginessVal = 0; 
            for(let j = 0; j < 9; j++) //calculate total cost, sweetness, and tanginess
            {
                totalCost += quantityApples[j]*appleCosts[j];
                sweetnessVal += quantityApples[j]*sweetnessVals[j];
                tanginessVal += quantityApples[j]*tanginessVals[j];
            }
            totalGal = totalWeight / 16.0; //calculate total gallons
            update();
        });
    }
}

//works on the quality section
function appleQuality()
{
    let lastQualityMultiplier = 1; //this variable is needed to ensure that the total cost is reflected accurately, stores the last value used from qualityCostMultiplier
    const qualityArray = ['unripe', 'fresh', 'fridge', 'sitting', 'rough', 'bottom']; // array of qualities
    const qualityCostMultiplier = [0.75, 1.2, 1, 0.8, 0.65, 0.05]; // array of cost multipliers
    let appleQuality = document.getElementsByClassName("quality-option");
    for(let i = 0; i <appleQuality.length; i++)
    {
        appleQuality[i].addEventListener("mousedown", function() //each time a button is clicked, set the current qualityVal, divide by the last cost multiplier and apply the new cost multiplier
        {
            qualityVal = qualityArray[i];
            costMultiplier /= lastQualityMultiplier;
            lastQualityMultiplier = qualityCostMultiplier[i];
            costMultiplier *= lastQualityMultiplier;
            update();                                           //make the changes visible 
            appleQuality[i].style.border = "lime 5px solid"; //change the style and reset the style of the others
            for(let j=0; j<appleQuality.length; j++)
            {
                if(j!=i)
                    appleQuality[j].style.border = "black 1px solid";
            }
        });
    }
}

//works on the processing section, functionally the same as the quality section
function appleProcessing()
{
    let lastProcessingMultiplier = 1; //this variable is needed to ensure that the total cost is reflected accurately, stores the last value used from processingCostMultiplier
    const processingArray = ['press', 'processor', 'blender', 'chopper', 'knife', 'fists']; // array of processes
    const processingCostMultiplier = [1.5, 1.3, 1.2, 1.15, 1.1, 1] // array of cost multipliers
    let appleProcessing = document.getElementsByClassName("processing-option");
    for(let i = 0; i <appleProcessing.length; i++)
    {
        appleProcessing[i].addEventListener("mousedown", function() //each time a button is clicked, set the current qualityVal, divide by the last cost multiplier and apply the new cost multiplier
        {
            processingVal = processingArray[i];
            costMultiplier /= lastProcessingMultiplier;
            lastProcessingMultiplier = processingCostMultiplier[i];
            costMultiplier *= lastProcessingMultiplier;
            update(); //make the changes visible 
            appleProcessing[i].style.border = "lime 5px solid"; //change the style and reset the style of the others
            for(let j=0; j<appleProcessing.length; j++)
            {
                if(j!=i)
                    appleProcessing[j].style.border = "black 1px solid";
            }
        });
    }
}

//works on the fermentation section
function appleFermentation()
{
    let lastFermentationVal = 1; //stores the last fermentation value 
    let appleFermentation = document.getElementById("fermentationDays");
    let fermentationDependent = document.getElementsByClassName("fermentation-dependent"); //gets the elements that depend on a positive fermentationVal to be visible
    appleFermentation.addEventListener("input", function()
    {
        if (Number(appleFermentation.value) > 0) //if the input is positive, the fermentationVal is saved, the dependent elements are displayed, and costs updated
        {
            fermentationVal = Number(appleFermentation.value);
            for (let i = 0; i<fermentationDependent.length; i++)
                fermentationDependent[i].style.display = "table-row";
            costMultiplier /= lastFermentationVal;
            lastFermentationVal = fermentationVal;
            costMultiplier *= fermentationVal;
            update();
        }
        else                                    //is the input is not positive, the fermentationVal is set to 0, the dependnet elements are hidden, and costs updated
        {
            fermentationVal = 0;
            for (let i = 0; i<fermentationDependent.length; i++)
                fermentationDependent[i].style.display = "none";
            costMultiplier /= lastFermentationVal;
            lastFermentationVal = 1;
            update();
        }
    });
}

//works on the site section that appears when fermentationVal is set to a positive value
function appleSite()
{
    let lastSiteMultiplier = 1;
    const siteArray = ['orchard', 'vat', 'cellar', 'pantry', 'shack', 'outdoors'];
    const siteCostMultiplier = [1.5, 1.3, 1.1, 1.05, 1.01, 1.0];
    const appleSite = document.getElementsByClassName("site-option");
    for(let i = 0; i <appleSite.length; i++)
    {
        appleSite[i].addEventListener("mousedown", function()
        {
            appleSite[i].style.border = "lime 5px solid";
            for(let j=0; j<appleSite.length; j++)
            {
                siteVal = siteArray[i];
                costMultiplier /= lastSiteMultiplier;
                lastSiteMultiplier = siteCostMultiplier[i];
                costMultiplier *= lastSiteMultiplier;
                update();
                if(j!=i)
                    appleSite[j].style.border = "black 1px solid";
            }
        });
    }
    // if fermentation value is becomes 0, then it calls the reset function
    let appleFermentation = document.getElementById("fermentationDays");
    appleFermentation.addEventListener("input", function()
    {
        if (Number(appleFermentation.value) === 0)
        {
            resetAppleSite(lastSiteMultiplier);
            lastSiteMultiplier = 1;
        }
    });
}

//resets the site section css and updates all the values
function resetAppleSite(siteMultiplier)
{
    costMultiplier /= siteMultiplier;
    const appleSite = document.getElementsByClassName("site-option");
    for(let i = 0; i < appleSite.length; i++)
        appleSite[i].style.border = "black 1px solid";
    update();
}

// sets the pasteurization value
function applePasteurization()
{
    let applePasteurization = document.getElementById("pasteurizationTemp");
    applePasteurization.addEventListener("input", function()
    {
        pasteurizationVal = Number(applePasteurization.value);
    });
}

//load the curator modal
function loadCurator()
{
    let modal = document.getElementById("curatorModal");
    let button = document.getElementById("submitButton");
    let closeSpan = document.getElementsByClassName("close");

    // open the modal when the button is clicked
    button.addEventListener("click", function()
    {
        let modalContents = document.getElementsByClassName("modal-content"); //all possible modal screens
        //first close all possible modal contents
        for (let i=0; i<modalContents.length; i++)
        {
            modalContents[i].style.display = "none";
        }
        document.getElementById("loading").style.display = "block"; //open the loading screen
        //check to make sure all fields are filled out: either fermentationVal is 0 and there is no siteVal, or fermentationVal is greater than 0 and there is a siteVal
        if((sweetnessVal && tanginessVal && qualityVal && processingVal && !fermentationVal) || (fermentationVal && sweetnessVal && tanginessVal && qualityVal && processingVal && siteVal))
        {
            modal.style.display = "block";
            loadProgress();
        }
        else
            alert("You need to fill out all fields!");
        
    });

    //x button for all modal screens, closes the modal
    for(let i = 0; i < closeSpan.length; i++)
    {
        closeSpan[i].addEventListener("click", function()
    {
        modal.style.display = "none";
    });
    }

    //closes the modal screen if the users clicks outside of it
    window.addEventListener("click", function(event)
    {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });   
}

//function for the progress bar, because why not?
function loadProgress() 
{
    let curatorStatus = document.getElementById("curatorStatus");
    curatorStatus.innerHTML = "The curator is taste testing...";
    let i = false;
    if (i === false) 
    {
        i = true;
        let progressBar = document.getElementById("progressBar");
        let barWidth = 1;
        let id = setInterval(frame, 20); //run each frame 20 milliseconds between each other
        function frame() 
        {
            if (barWidth >= 100) 
            {
                curatorStatus.innerHTML = "The curator is done!";
                setTimeout(function()
                {
                    calculateCurator();
                }, 1000); // load the curator results one second after the loading bar finihses
                clearInterval(id);
                barWidth = 1;
                i = false;
            } 
            else //increase the barWidth
            {
                barWidth++;
                progressBar.style.width = barWidth + "%";
                progressBar.innerHTML = barWidth + "%";
            }
        }
    }
}

function calculateCurator()
{
    let sweetness = 0, tanginess = 0, deliciousness = 0, bite = 10, sickness = 0;
    console.log(sweetnessVal, tanginessVal, qualityVal, processingVal, fermentationVal, siteVal, pasteurizationVal);
    sweetness = sweetnessVal*100; //sweetnessVal is a weighted average of the apple sweetness values between 0 and 1. sweetness multiplies it by 100
    tanginess = tanginessVal*100; //tanginess is the same procedure as sweetness
    
    deliciousness = sweetness+tanginess - Math.abs(sweetness - tanginess); //deliciousness is initially dependent on the sum of the sweetness and tanginess minus their difference

    switch (qualityVal) //different quality selections yield different results
    {
        case 'unripe':
            bite = 0;
            deliciousness *= 1;
            sickness += 2;
            break;
        case 'fresh':
            deliciousness *= 1.4;
            sickness += 3;
            break;
        case 'fridge':
            deliciousness *= 1.1;
            sickness += 1;
            break;
        case 'sitting':
            deliciousness *= 1.0
            sickness += 5;
            break;
        case 'rough':
            deliciousness *= 0.5
            sickness += 15;
            break;
        case 'bottom':
            deliciousness *= 0.01;
            sickness += 100;
            break;
        default:
            sickness +=5;
    }
    switch (processingVal) //different processing selections
    {
        case 'press':
            deliciousness *= 1.5;
            sickness += 1;
            break;
        case 'processor':
            deliciousness *= 1.3;
            sickness += 1;
            break;
        case 'blender':
            deliciousness *= 1.2;
            sickness += 1;
            break;
        case 'chopper':
            deliciousness *= 1.1;
            sickness += 1;
            break;
        case 'knife':
            deliciousness *= 1.0;
            sickness += 2;
            break;
        case 'fists':
            deliciousness *= 1.0;
            sickness += 5;
            break;
        default:
            sickness +=5;
    }
        
    switch (siteVal) //different site selections
    {
        case 'orchard':
            sickness += 1;
            break;
        case 'vat':
            sickness += 1;
            break;
        case 'cellar':
            sickness += 2;
            break;
        case 'pantry':
            sickness += 3;
            break;
        case 'shack':
            sickness += 10;
            break;
        case 'outdoors':
            sickness += 100;
            break;
        default:
            sickness += 5;
    }
    if(fermentationVal) //if fermentation is positive, deliciousness increases but may also decrease. Sickness increases, and bite also increases
    {
        deliciousness *= 1+Math.log(fermentationVal);
        deliciousness -= 2*(Math.abs(sweetness - tanginess))*1.1**fermentationVal;
        sickness *= 1+ 0.1*Math.log(fermentationVal);
        bite *= 1+Math.log(fermentationVal);
    }

    if (pasteurizationVal < 160) // pasteurization values below 160 increase sickness, pasteurization values above 185 decrease deliciousness
        sickness *= (1 + (160 - pasteurizationVal)/10)**3;
    else if (pasteurizationVal > 185)
    {
        deliciousness /= (2 + (pasteurizationVal - 185)/185)**2;
        sickness /= 2
    }
    else
        sickness /= 1.5

    console.log(deliciousness, bite, sickness);
    curatorResults(deliciousness, bite, sickness); //call the curator results
    
}

//calculate the curator results
function curatorResults(deliciousness, bite, sickness)
{
    let loading = document.getElementById("loading"); //close the loading screen
    loading.style.display = "none";
    let purchasePrice = (deliciousness/10) * bite / sickness; //price is dependent on deliciousness, bite, and sickness
    let curatorDisapproves = document.getElementById("curatorDisapproves");
    let disapprovalReason = document.getElementById("disapprovalReason");

    if (sickness > 100 && sickness < 1000) //if the sickness levels are between 100 and 1000, the curator becomes sick
        document.getElementById("curatorSick").style.display = "block";
    else if (sickness >= 1000) //if the sickness level surpasses 1000, the curator dies from spoiled, bad cider
        document.getElementById("curatorDies").style.display = "block";
    else if (bite >= 60) //if the bite surpasses 60, the alcohol content becomes too much
    {
        document.getElementById("curatorDies").style.display = "block";
        document.getElementById("alcohol").innerHTML = "from alcohol poisoning ";
    }
    else if (bite>=40)
    {
        curatorDisapproves.style.display = "block";
        disapprovalReason.innerHTML = "This is literally vinegar";
    }
    else if (bite === 0) //if bite is 0, the curator is unhappy due to the flat cider
    {
        curatorDisapproves.style.display = "block";
        disapprovalReason.innerHTML = "This cider is flat";
    }
    else if(deliciousness > 100 && bite < 15) //if deliciousness is high yet bite is low, then the curator is confused because it's effectively apple juice
    {
        document.getElementById("curatorConfused").style.display = "block";
        document.getElementById("confusionReason").innerHTML = "This is basically apple juice";
    }
    else if(deliciousness < 100) //if deliciousness is low, curator is unhappy because it tastes bad
    {
        curatorDisapproves.style.display = "block";
        disapprovalReason.innerHTML = "This doesn't taste good.";
    }
    else if(deliciousness > 100 && bite >=15) //if the deliciousness and bite are sufficiently high, the curator is happy and gives a price
    {
        document.getElementById("curatorApproves").style.display = "block";
        document.getElementById("approvalPrice").innerHTML = purchasePrice.toFixed(2);
        let profitSpan = document.getElementById("profit");
        let totalProfitSpan = document.getElementById("totalProfit");
        let profit = (purchasePrice - totalCost*costMultiplier/totalGal).toFixed(2);
        if (profit < 0) //red if negative profit
        {
            profitSpan.style.color = "red";
            totalProfitSpan.style.color = "red";
        }
        else // green is nonnegative profit
        {
            profitSpan.style.color = "lime";
            totalProfitSpan.style.color = "lime";
        }
        profitSpan.innerHTML = "$" + profit;
        totalProfitSpan.innerHTML = "$" + (profit * totalGal).toFixed(2); 
    }

    let modal = document.getElementById("curatorModal");
    let closeSpan = document.getElementsByClassName("close");

    //close the modal is the x button is clicked
    for(let i = 0; i < closeSpan.length; i++)
    {
        closeSpan[i].addEventListener("click", function()
    {
        modal.style.display = "none";
    });
    }
    //close the modal if the user clicks off the modal
    window.addEventListener("click", function(event)
    {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });  
}