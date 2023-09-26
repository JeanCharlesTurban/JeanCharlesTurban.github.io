import streamlit as st
import pandas as pd

print("======================================")

# TODO LIST
# Have the text file render correctly in the text area 
# Button to have the text file saved
# Display tasks
# Connect checkbox for tasks to change the correct row in the DF
# For when items get marked as checked log them in the database and remove from writing


PATH_TO_FILE = 'C:/Users/Jean Turban/Desktop/todos.txt'
PATH_TO_DATABSE = "data/database.csv"

def session_vars():
    if "local_tasks_loaded" not in st.session_state:
        st.session_state.local_tasks_loaded = False
    if "tasks_df" not in st.session_state:
        st.session_state.tasks_df = None
    if "file" not in st.session_state:
        st.session_state.file = None

def read_todo_file(file_path):

    master_dict = {}
    counter = 0
    mega_string = ''''''

    with open(file_path, 'r') as file:

        current_group = "DEFAULT"
        for line in file:
            print(line)
            mega_string += line
            result = route_string(line,current_group)
            if result is not None:
                if "group_flag" in result.keys():
                    current_group = result["group_flag"]
                else:
                    master_dict[counter] = result
                    counter += 1

    st.session_state.file=mega_string

    return master_dict

def route_string(text_string,prev_group):

    # CASE 1 Header
    if text_string[0] == "#":
        group_str = text_string.replace("#","")
        if "|" in group_str:
            group_str = group_str.split("|")[0]
        group_str = group_str.strip()
        return {"group_flag" : group_str}
    
    # CASE 2 Seperator
    elif text_string[0] == "=":
        return None
    
    # Case 3 Task
    elif text_string[0] == "[":
        return turn_string_into_data(text_string,prev_group)

    else:
        return None

def turn_string_into_data(text_string,group):

    list_of_date = text_string.split("|")
    status_str = list_of_date[0][:3]
    task_str = list_of_date[0][3:]
    priority_str = list_of_date[1]
    time_str = list_of_date[2]


    data_dict = {}


    if("X" in status_str or "x" in status_str):
        data_dict["status"] = "Completed"
    else:
        data_dict["status"] = "Not Completed"

    data_dict["task"] = task_str.strip()

    data_dict["priority"] = priority_str.count("^")
    data_dict["time_est"] = time_str.replace("|","").strip()
    data_dict["group"] = group

    return data_dict
    
def dict_to_dataframe(task_dict):
    # Create DataFrame from dictionary
    df = pd.DataFrame.from_dict(task_dict, orient='index')
    
    return df

def write_task_to_text(df):

    mega_string = []
    seen_groups = []


    # 0 is status
    # 1 is task
    # 2 is needed buffer
    # 3 is priority + buffer
    # 4 is time est
    template_str = "[{0}] {1}{2}|{3}|{4}"
    header_str = "#  {0}{1}|{2}|{3}"
    sperator_string = "========================================================================|=======|=========="

    for index, row in df.iterrows():
        current_group = row["group"]
        if(current_group not in seen_groups):
            temp_str = current_group
            buffer_length = (69 - len(temp_str)) * " "
            final_str = header_str.format(temp_str, buffer_length, 7*" ", 7*" ")
            mega_string.append(sperator_string)
            mega_string.append(final_str)
            seen_groups.append(current_group)
        
        task_temp = row["task"]
        status_temp = row["status"]
        priority_temp = row["priority"]
        time_est = row["time_est"]

        if(status_temp == "Completed"):
            status_str = "x"
        else:
            status_str = " "

        priority_string = (priority_temp*"^")+((7-priority_temp)*" ")
        time_est_string = time_est
        buffer_length = (69 - 1 - len(task_temp)) * " "

        final_str = template_str.format(status_str, task_temp, buffer_length,priority_string,time_est_string)
        mega_string.append(final_str)
    # Open a file in write mode ('w')
    with open(PATH_TO_FILE, "w") as file:
        # Iterate through the list and write each item followed by a newline
        for item in mega_string:
            file.write(f"{item}\n")

def edit_txt_file_directly():
    edit_file = st.checkbox("Edit File")

    if(edit_file):
        edited_text = st.text_area("Edit File", st.session_state.file, height=600)

# READ THE FILE
df = dict_to_dataframe(read_todo_file(PATH_TO_FILE))

edit_txt_file_directly()

# DISPLAY THE DATA
st.write(df)

# WRITE THE DATA


## SAVE TXT
write_task_to_text(df)

## SAVE CSV
