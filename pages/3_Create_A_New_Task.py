import streamlit as st

from helperfunctions.reader_writers import *


def format_func_key(key):
    return st.session_state.tasks_dict[key]["task"]

MAPPING_DICT = {"Next Week":0, "This Week":1,"Next two days":2,"Today":3}


st.title("Create new or edit Task")


edit_check = st.checkbox("Edit an existing task")
select_a_task = st.selectbox("Select a task",options=st.session_state.tasks_dict.keys(),format_func=format_func_key)
st.divider()



if(edit_check):

    temp_task = st.session_state.tasks_dict[select_a_task]

    list_of_prio = ["Next Week", "This Week","Next two days","Today"]

    group_sel = st.selectbox("Select a group",st.session_state.tasks_df.group.unique(),index=list(st.session_state.tasks_df.group.unique()).index(temp_task["group"]))
    priority = st.select_slider("Prority Low to High",list_of_prio,value=list_of_prio[temp_task["priority"]])
    time_est = st.select_slider("Time Estimate High to low",["90min", "45min","15min","5min",""],value=temp_task["time_est"])
    task_str = st.text_input("Task Title and description",value=temp_task["task"])
else:
    group_sel = st.selectbox("Select a group",st.session_state.tasks_df.group.unique())
    priority = st.select_slider("Prority",["Next Week", "This Week","Next two days","Today"])
    time_est = st.select_slider("Time Estimate",["90min", "45min","15min","5min"])
    task_str = st.text_input("Task Title and description")







if(st.button("Save Task")):
    if(task_str == ""):
        st.error("Blank Task Cannot be added")
    else:
        max_dict_key = max(list(st.session_state.tasks_dict.keys()))+5000
        temp_dict = {"status": "Not Completed","task" : task_str,"priority":MAPPING_DICT[priority],"time_est":time_est,"group":group_sel}
        if(edit_check):
            print("Updating Task")
            st.session_state.tasks_dict[select_a_task] = temp_dict
        else:
            print("Creating Task")
            st.session_state.tasks_dict[max_dict_key] = temp_dict

print("Setting Tasks from file dict to df")
st.session_state.tasks_df = dict_to_dataframe(st.session_state.tasks_dict)

print("Updating CSV")
csv_database_handler()

print("Write DF to file")
write_task_to_text(st.session_state.tasks_df)
