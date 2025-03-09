const BASE_URL = "http://localhost:8080";

export function fetchDataBasedOnCountry(country) {
  return new Promise((resolve, reject) => {
    if (!country) {
      reject(new Error("Country parameter is required"));
      return;
    }

    const encodedCountry = encodeURIComponent(country);

    fetch(
      `${BASE_URL}/importData/getDataBasedOnCountry?country=${encodedCountry}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          `Data based on country (${country}) fetched successfully:`,
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchAllImportData() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/importData/getAllData`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("All import data fetched successfully:", data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

// Energy Import and Export Network Graph Controller Endpoints
export function fetchDataBasedOnSourceCountry(country) {
  return new Promise((resolve, reject) => {
    if (!country) {
      reject(new Error("Country parameter is required"));
      return;
    }

    const encodedCountry = encodeURIComponent(country);
    fetch(
      `${BASE_URL}/getDataForNetworkGraph/getDataBasedOnSourceCountry?country=${encodedCountry}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Network graph data based on source country fetched successfully:",
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchDataBasedOnCountryAndYear(country,year) {
  return new Promise((resolve, reject) => {
    if (!country) {
      reject(new Error("Country parameter is required"));
      return;
    }
    if (!year) {
      reject(new Error("Year parameter is required"));
      return;
    }

    const encodedCountry = encodeURIComponent(country);
    const encodedYear = encodeURIComponent(year);
    fetch(
      `${BASE_URL}/getDataForNetworkGraph/getDataBasedOnCountryAndYear?country=${encodedCountry}&year=${encodedYear}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Network graph data based on source country fetched successfully:",
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchAllCountriesNetworkGraph() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/getDataForNetworkGraph/getAllCountries`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "All countries network graph data fetched successfully:",
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

// Production Controller Endpoints
export function fetchDataBasedOnType(type) {
  return new Promise((resolve, reject) => {
    if (!type) {
      reject(new Error("Type parameter is required"));
      return;
    }

    const encodedType = encodeURIComponent(type);
    fetch(`${BASE_URL}/ProductionData/getDataBasedOnType?type=${encodedType}`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Production data based on type fetched successfully:",
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchCombinedProductionData() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/ProductionData/getCombinedData`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Combined production data fetched successfully:", data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchAllProductionData() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/ProductionData/getAllData`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("All production data fetched successfully:", data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

// Data for Steamgraph

export function fetchDataForSteamGraphBasedOnCountry(country) {
  return new Promise((resolve, reject) => {
    if (!country) {
      reject(new Error("Country parameter is required"));
      return;
    }

    const encodedCountry = encodeURIComponent(country);
    fetch(`${BASE_URL}/ProductionData/getDataForSteamGraphBasedOnCountry?country=${encodedCountry}`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("All production data fetched successfully:", data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchCountryListForSteamGraph() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/ProductionData/getCountryListForSteamGraph`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("All production data fetched successfully:", data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

// Radar chart
export function fetchRadarDataBasedOnCountryAndYear(country,year) {
  return new Promise((resolve, reject) => {
    if (!country) {
      reject(new Error("Country parameter is required"));
      return;
    }
    if (!year) {
      reject(new Error("Year parameter is required"));
      return;
    }

    const encodedCountry = encodeURIComponent(country);
    const encodedYear = encodeURIComponent(year);
    fetch(
      `${BASE_URL}/radarChart/getRadarChartDataByCountryAndYear?country=${encodedCountry}&year=${encodedYear}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Network graph data based on source country fetched successfully:",
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}

export function fetchAllCountriesRadarChart() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/radarChart/getCountryList`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "All countries network graph data fetched successfully:",
          data
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Comprehensive error:", {
          message: error.message,
          stack: error.stack,
        });
        reject(error);
      });
  });
}