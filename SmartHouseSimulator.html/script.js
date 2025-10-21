// Variabile generale
let energieGenerata = 0;
let energieBaterie = 0;
let consumLumina = 10;
let consumApa = 5;
let consumIncalzire = 15;
let capacitateBaterie = 100;

// Stare consumatori
let luminaOn = true;
let apaOn = true;
let incalzireOn = true;

// Slider soare
let intensitateSoare = 10;
document.getElementById("sliderSoare").oninput = function() {
    intensitateSoare = parseInt(this.value);
};

// Toggle consumatori
document.getElementById("toggleLumina").onclick = () => luminaOn = !luminaOn;
document.getElementById("toggleApa").onclick = () => apaOn = !apaOn;
document.getElementById("toggleIncalzire").onclick = () => incalzireOn = !incalzireOn;

// Ora simulare
let oraSimulare = 8;

// Chart.js grafice
const graficBaterie = new Chart(document.getElementById('graficBaterie').getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Nivel baterie', data: [], borderColor: 'rgb(0,121,107)', backgroundColor: 'rgba(0,121,107,0.2)', fill: true }]},
    options: { responsive: true, scales: { y: { min: 0, max: capacitateBaterie }}}
});
const grafLumina = new Chart(document.getElementById('grafLumina').getContext('2d'), { type:'line', data:{labels:[], datasets:[{label:'Lumina', data:[], borderColor:'yellow', fill:false}]}});
const grafApa = new Chart(document.getElementById('grafApa').getContext('2d'), { type:'line', data:{labels:[], datasets:[{label:'Apă', data:[], borderColor:'blue', fill:false}]}});
const grafInc = new Chart(document.getElementById('grafIncalzire').getContext('2d'), { type:'line', data:{labels:[], datasets:[{label:'Încălzire', data:[], borderColor:'red', fill:false}]} });

// Funcție simulare
function simulare() {
    // Fundal zi/noapte
    document.body.style.backgroundColor = (oraSimulare>=6 && oraSimulare<=18) ? "#e0f7fa" : "#001f3f";

    // Nori reduc energie
    let norReducere = Math.random()<0.3 ? Math.floor(Math.random()*5) : 0;
    energieGenerata = Math.floor(Math.random()*intensitateSoare) - norReducere;
    if(energieGenerata<0) energieGenerata=0;

    // Baterie
    energieBaterie += energieGenerata;
    if(energieBaterie>capacitateBaterie) energieBaterie=capacitateBaterie;

    // Consum total cu prioritizare
    let totalConsum = 0;
    if(luminaOn) totalConsum+=consumLumina;
    if(apaOn) totalConsum+=consumApa;
    if(incalzireOn) totalConsum+=consumIncalzire;

    if(energieBaterie>=totalConsum){
        energieBaterie-=totalConsum;
        setConsumatori(true,true,true);
    } else {
        if(energieBaterie>=consumApa){
            energieBaterie-=consumApa;
            setConsumatori(false,true,false);
            if(energieBaterie>=consumLumina){
                energieBaterie-=consumLumina;
                setConsumatori(true,true,false);
                if(energieBaterie>=consumIncalzire){
                    energieBaterie-=consumIncalzire;
                    setConsumatori(true,true,true);
                } else { setConsumatori(true,true,false); }
            }
        } else { setConsumatori(false,false,false); }
    }

    // Actualizare HTML
    document.getElementById("energieGen").textContent = energieGenerata;
    document.getElementById("energieBat").textContent = energieBaterie;
    document.getElementById("nivelBaterie").style.width = (energieBaterie/capacitateBaterie*100) + "%";

    // Actualizare grafice
    let timp = oraSimulare+":00";
    updateGrafice(graficBaterie,timp,energieBaterie);
    updateGrafice(grafLumina,timp,luminaOn?consumLumina:0);
    updateGrafice(grafApa,timp,apaOn?consumApa:0);
    updateGrafice(grafInc,timp,incalzireOn?consumIncalzire:0);

    // Ora creste
    oraSimulare++;
    if(oraSimulare>24) oraSimulare=0;
}

// Setare vizual consumatori
function setConsumatori(lumina, apa, incalzire){
    document.getElementById("lumina").style.opacity=lumina?"1":"0.4";
    document.getElementById("lumina").style.color=lumina?"yellow":"gray";
    document.getElementById("apa").style.opacity=apa?"1":"0.4";
    document.getElementById("incalzire").style.opacity=incalzire?"1":"0.4";
    document.getElementById("incalzire").style.color=incalzire?"red":"gray";
}

// Update grafice
function updateGrafice(graf,label,val){
    graf.data.labels.push(label);
    graf.data.datasets[0].data.push(val);
    if(graf.data.labels.length>20){
        graf.data.labels.shift();
        graf.data.datasets[0].data.shift();
    }
    graf.update();
}

// Rulează simularea la fiecare 1 sec
setInterval(simulare,1000);

// Drag & Drop (mini-joc interactiv)
const draggable = document.querySelectorAll('.draggable');
draggable.forEach(item=>{
    item.addEventListener('dragstart', e=>{
        e.dataTransfer.setData("text", e.target.id);
    });
});
const dropzone = document.createElement('div');
dropzone.className='dropzone';
dropzone.textContent='Trage consumator aici pentru a-l opri temporar';
document.body.appendChild(dropzone);

dropzone.addEventListener('dragover', e=>e.preventDefault());
dropzone.addEventListener('drop', e=>{
    e.preventDefault();
    let id = e.dataTransfer.getData("text");
    if(id==="lumina") luminaOn=false;
    if(id==="apa") apaOn=false;
    if(id==="incalzire") incalzireOn=false;
    setConsumatori(luminaOn,apaOn,incalzireOn);
});


