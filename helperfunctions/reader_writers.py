import streamlit as st
import pandas as pd
from helperfunctions.encoders import *


def csv_database_handler():

    # GETTING COMPLETED TASKS AND SETTING UUID INDEX
    completed_tasks = st.session_state.tasks_df[st.session_state.tasks_df["status"]=="Completed"]
    completed_tasks.index = [generate_key(task) for task in completed_tasks['task']]

    # GETTING IN-COMPLETED TASKS AND SETTING UUID INDEX
    not_completed_tasks = st.session_state.tasks_df[st.session_state.tasks_df["status"]=="Not Completed"]
    not_completed_tasks.index = [generate_key(task) for task in not_completed_tasks['task']]

    # GETTING OLD LIST OF COMPLETE TASKS and dropping in-complete
    old_csv =  pd.read_csv(st.session_state.PATH_TO_DATABSE,index_col=0)
    old_csv = old_csv.drop(not_completed_tasks.index, errors='ignore')

    # MERGING OLD AND NEW
    consolidated_df = pd.concat([old_csv, completed_tasks], axis=0)
    consolidated_df = consolidated_df.loc[~consolidated_df.index.duplicated(keep='first')]

    consolidated_df.to_csv(st.session_state.PATH_TO_DATABSE, index=True)

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
    with open(st.session_state.PATH_TO_FILE, "w") as file:
        # Iterate through the list and write each item followed by a newline
        for item in mega_string:
            file.write(f"{item}\n")

def dict_to_dataframe(task_dict):
    # Create DataFrame from dictionary
    df = pd.DataFrame.from_dict(task_dict, orient='index')
    
    return df

def read_todo_file(file_path):

    master_dict = {}
    counter = 0
    mega_string = ''''''

    with open(file_path, 'r') as file:

        current_group = "DEFAULT"
        for line in file:
            mega_string += line
            try:
                result = route_string(line,current_group)
            except:
                st.error(line)
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