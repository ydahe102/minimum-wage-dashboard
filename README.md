# Canadian Provincial Minimum Wage Dashboard

An interactive bilingual dashboard for exploring and comparing provincial minimum wages in Canada from 2016 to 2026.

This project was created for **SEG 3125 – Analysis and Design of User Interfaces**. 

## Project Goal

The dashboard helps users:

- compare minimum wages across Canadian provinces;
- examine changes over time;
- compare wage values and percentage growth since 2016;
- explore the data in English or French.

## Dashboard Features

- A line chart showing minimum wage history from 2016 to 2026
- A bar chart comparing provinces for a selected year
- Filters for province, year, and measure
- KPI cards showing the selected average, highest value, and range
- Interactive tooltips, sorting, highlighting, and reset controls
- English and French interface options
- Keyboard support and responsive design

## Data Source

The data comes from the Government of Canada’s official historical minimum wage records:

- [Historical minimum wage rates – English](https://minwage-salairemin.service.canada.ca/en/since1965.html)
- [Taux historiques du salaire minimum – Français](https://minwage-salairemin.service.canada.ca/fr/since1965.html)
- [Open Government dataset](https://open.canada.ca/data/en/dataset/390ee890-59bb-4f34-a37c-9732781ef8a0)

To support consistent yearly comparisons, the dashboard uses the wage rate that was in effect on **January 1 of each year**. It focuses on the ten Canadian provinces to keep the comparison clear and readable.

## Technologies Used

React, JavaScript, CSS, SVG, CSV, and Vite.