from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def root():
    return 'Server is running'

@app.route('/stacked_bar_chart')
def display_stacked_bar_chart():
    # return send_from_directory('.', 'index.html')
    return render_template('index.html')

@app.route('/map_markers')
def display_map_markers():
    return render_template('map_template.html', js_file='markerMap.js')

@app.route('/map_heat')
def display_map_heat():
    return render_template('map_template.html', js_file='heatMap.js')
