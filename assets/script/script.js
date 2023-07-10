$(function() {
    // Triggered when the search button is clicked
    $('#searchBtn').on('click', function() {
        var city = $('#cityInput').val();
        getWeatherData(city);
        addToSearchHistory(city);
        getForecastData(city);
    });

    // Fetches weather data for a specific city
    function getWeatherData(city) {
        var apiKey = '2c56ed7b03ee61202f440366652856ea';
        var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                displayWeatherData(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    // Displays weather data on the page
    function displayWeatherData(data) {
        var weatherContainer = $('#weatherContainer');
        weatherContainer.empty();

        var cityName = $('<h2 class="d-flex">').text(data.name);
        var temperature = $('<p>').text('Temperature: ' + (data.main.temp - 273.15).toFixed(2) + '°C');
        var humidity = $('<p>').text('Humidity: ' + data.main.humidity + '%');
        var windSpeed = $('<p>').text('Wind Speed: ' + data.wind.speed + ' m/s');
        var timestamp = $('<p>').text("(" + dayjs().format('YYYY/MM/DD') + ")");
        timestamp.css('margin-left', 'auto'); 
        timestamp.css('font-size', '2rem');

        var weatherCode = data.weather[0].icon;
        var weatherIconClass = getWeatherIconClass(weatherCode);
        var weatherIcon = $('<span>').addClass(weatherIconClass).text(getWeatherIcon(weatherCode));

        timestamp.append(weatherIcon); // Append weather icon to the timestamp element
        cityName.append($('<span>').css('float', 'right').append(timestamp)); // Append timestamp to the city name element with a floated right span

        weatherContainer.append(cityName, temperature, humidity, windSpeed);
    }

    // Retrieves the appropriate weather icon class based on the weather code
    function getWeatherIconClass(weatherCode) {
        var weatherIcons = {
            '01d': 'weather-sunny',
            '01n': 'weather-clear-night',
            '02d': 'weather-partly-cloudy',
            '02n': 'weather-partly-cloudy',
            '03d': 'weather-cloudy',
            '03n': 'weather-cloudy',
            '04d': 'weather-cloudy',
            '04n': 'weather-cloudy',
            '09d': 'weather-showers',
            '09n': 'weather-showers',
            '10d': 'weather-rain',
            '10n': 'weather-rain',
            '11d': 'weather-storm',
            '11n': 'weather-storm',
            '13d': 'weather-snow',
            '13n': 'weather-snow',
            '50d': 'weather-fog',
            '50n': 'weather-fog',
        };

        return weatherIcons[weatherCode] || 'weather-none';
    }

    // Retrieves the appropriate weather icon based on the weather code
    function getWeatherIcon(weatherCode) {
        var weatherIcons = {
            '01d': '☀',
            '01n': '🌙',
            '02d': '⛅',
            '02n': '⛅',
            '03d': '☁',
            '03n': '☁',
            '04d': '☁',
            '04n': '☁',
            '09d': '🌧',
            '09n': '🌧',
            '10d': '🌦',
            '10n': '🌦',
            '11d': '⚡',
            '11n': '⚡',
            '13d': '❄',
            '13n': '❄',
            '50d': '🌫',
            '50n': '🌫',
        };

        return weatherIcons[weatherCode] || '';
    }

    // Adds the searched city to the search history
    function addToSearchHistory(city) {
        var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Check if the city already exists in the search history
        if (searchHistory.includes(city)) {
            return;
        }

        // Add the city to the search history
        searchHistory.push(city);

        // Save the updated search history in local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Update the search history list
        updateSearchHistoryList(searchHistory);
    }

    function updateSearchHistoryList(searchHistory) {
        var historyList = $('#searchHistoryList');
        historyList.empty();
      
        // Generate list items for each city in the search history
        searchHistory.forEach(function(city) {
          var listItem = $('<li>').text(city);
          listItem.addClass('border box-size');
      
          // Create delete button
          var deleteButton = $('<button>')
            .addClass('delete-button')
            .html('<i class="fa fa-trash" aria-hidden="true"></i>');
      
          // Add click event handler to delete button
          deleteButton.on('click', function(event) {
            event.stopPropagation(); // Prevent event propagation to the list item
            deleteFromSearchHistory(city);
          });
      
          // Add click event handler to list item
          listItem.on('click', function() {
            getWeatherData(city);
            getForecastData(city);
          });
      
          listItem.append(deleteButton);
          historyList.append(listItem);
        });
      }
      

    // Deletes a city from the search history
    function deleteFromSearchHistory(city) {
        var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
        // Find the index of the city in the search history
        var index = searchHistory.indexOf(city);
    
        if (index !== -1) {
            // Remove the city from the search history
            searchHistory.splice(index, 1);
    
            // Save the updated search history in local storage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
            // Update the search history list
            updateSearchHistoryList(searchHistory);
        }
    }

    // Fetches forecast data for a specific city
    function getForecastData(city) {
        var apiKey = '2c56ed7b03ee61202f440366652856ea';
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                displayForecastData(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    // Displays forecast data on the page
    function displayForecastData(data) {
        var forecastContainer = $('#forecastContainer');
        forecastContainer.empty();

        var forecastTitle = $('<h2>').text('5-Day Forecast');
        forecastTitle.css('text-align', 'left');
        forecastTitle.css('margin-top', '-10px');

        var forecastList = $('<ul>').addClass('forecast-list');

        // Loop through the forecast data and generate list items
        for (var i = 0; i < data.list.length; i += 8) {
            var forecastItem = data.list[i];
            var date = dayjs.unix(forecastItem.dt).format('YYYY/MM/DD');
            var temperature = (forecastItem.main.temp - 273.15).toFixed(2) + '°C';
            var humidity = 'Humidity: ' + forecastItem.main.humidity + '%';
            var windSpeed = 'Wind Speed: ' + forecastItem.wind.speed + ' m/s';
            var weatherCode = forecastItem.weather[0].icon;
            var iconClass = getWeatherIconClass(weatherCode);
            var weatherIcon = $('<span>').addClass(iconClass).text(getWeatherIcon(weatherCode));

            var listItem = $('<li>').addClass('forecast-item');
            listItem.append($('<p>').text(date));
            listItem.append($('<p>').text('Temperature: ' + temperature));
            listItem.append($('<p>').text(humidity));
            listItem.append($('<p>').text(windSpeed));
            listItem.append($('<p>').append(weatherIcon)); // Append weather icon to the list item

            forecastList.append(listItem);
        }

        forecastContainer.append(forecastTitle, forecastList);
    }

    // Retrieve search history from local storage and update the list on page load
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    updateSearchHistoryList(searchHistory);
});
