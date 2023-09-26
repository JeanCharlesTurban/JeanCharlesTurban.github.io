import streamlit as st
import pandas as pd
import subprocess

from helperfunctions.display_tasks import *
from helperfunctions.reader_writers import *
from helperfunctions.encoders import *



print("======================================")

# TODO LIST
# Have the text file render correctly in the text area 
# Button to have the text file saved
# Display tasks
# Connect checkbox for tasks to change the correct row in the DF
# For when items get marked as checked log them in the database and remove from writing


st.session_state.PATH_TO_FILE = 'C:/Users/Jean Turban/Desktop/To Dos.txt'
st.session_state.PATH_TO_DATABSE = "data/database.csv"

st.sidebar.title("Controls")
cols = st.sidebar.columns(2)

if cols[0].button('Open File'):
    try:
        with st.spinner("File Open"):
            subprocess.run(['notepad.exe', st.session_state.PATH_TO_FILE])
        st.success('File closed successfully!')
    except Exception as e:
        st.error(f"An error occurred: {e}")

def session_vars():
    if "local_tasks_loaded" not in st.session_state:
        st.session_state.local_tasks_loaded = False
    if "tasks_df" not in st.session_state:
        st.session_state.tasks_df = None
    if "tasks_dict" not in st.session_state:
        st.session_state.tasks_dict = None
    if "widget_states" not in st.session_state:
        st.session_state.widget_states = {}


session_vars()

# READ THE FILE
print("Opening File and saving to dict")
st.session_state.tasks_dict = read_todo_file(st.session_state.PATH_TO_FILE)

print("Setting Tasks from file dict to df")
st.session_state.tasks_df = dict_to_dataframe(st.session_state.tasks_dict)

# DISPLAY THE DATA
print("Display DF and tasks")
display_today_tasks()
side_bar_group_status()



# WRITE THE DATA
## SAVE CSV
print("Updating CSV")
csv_database_handler()

## SAVE TXT
print("Write DF to file")
write_task_to_text(st.session_state.tasks_df)




cols[1].button("Refresh")