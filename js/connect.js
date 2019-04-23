let tStart = null;
let tEnd = null;
let image = new Image();
let counter = 0;
let arrTimes = [];
let abortFallback = false;

export default function checkConnectivity(timeToCount = 3, threshold = 3000, offlineTimeout = 3000) {
  // Test if navigator got connexion (null = true)
  if (navigator.onLine) {
    changeConnectivity(true);
  } else {
    setTimeout(() => {
      changeConnectivity(false);
    }, offlineTimeout);
  }

  // Test de la connectivité si jamais elle change
  window.addEventListener('online', e => {
    changeConnectivity(true);
  });

  window.addEventListener('offline', e => {
    setTimeout(() => {
      changeConnectivity(false);
    }, offlineTimeout);
  });

  timeoutFallback(threshold);
  checkLatency(timeToCount, offlineTimeout, average => handleLatency(average, threshold));
  setInterval(() => {
    reset();
    checkLatency(timeToCount, offlineTimeout, average => handleLatency(average, threshold));
  }, 6000);
}

function checkLatency(timeToCount, offlineTimeout, callback){
  tStart = new Date().getTime();
  if (counter < timeToCount){
    image.src = "https://www.google.com/images/phd/px.gif?t=" + tStart;
    // Get image loading time
    image.onload = function(e){
      abortFallback = true
      tEnd = new Date().getTime();
      let time = tEnd - tStart;
      arrTimes.push(time);
      checkLatency(timeToCount, offlineTimeout, callback);
      counter++
    };
    image.offline = function () {
      setTimeout(() => {
        changeConnectivity(false);
      }, offlineTimeout)
    }
  } else {
    const sum = arrTimes.reduce((a, b) => a + b);
    const average = sum / arrTimes.length;
    callback(average)
  }
}

function handleLatency(average, threshold) {
  const isConnectedFast = average <= threshold;

  if (!isConnectedFast) return changeConnectivity(false);

  changeConnectivity(true);
}

function reset() {
  arrTimes =  [];
  counter = 0;
}

function changeConnectivity(state) {
  const event = new CustomEvent('connectivity-changed', {
    detail: state
  });

  document.dispatchEvent(event);
}

function timeoutFallback(threshold) {
  setTimeout(() => {
    if (!abortFallback) {
      console.log('Connectivity too slow...');
      changeConnectivity(false);
    }
  }, threshold + 1);
  
}
