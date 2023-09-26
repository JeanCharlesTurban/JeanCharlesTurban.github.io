import pandas as pd
import streamlit as st
from helperfunctions.reader_writers import *
from datetime import datetime


def side_bar_group_status():

    st.sidebar.header("Status of tasks")
    groups = st.session_state.tasks_df.group.unique()

    for group in groups:

        temp_df = st.session_state.tasks_df[st.session_state.tasks_df["group"]==group]

        status_of_one_df(temp_df,group,st.sidebar)

def status_of_one_df(df,title,render_object):

    complete_num = calculate_percent_done(df)

    my_bar = render_object.progress(complete_num, text=title)

def calculate_percent_done(df):
    completed_tasks = df[df["status"]=="Completed"]
    not_completed_tasks = df[df["status"]!="Completed"]

    complete_num = len(completed_tasks) / len(df)
    return complete_num

def display_df_of_tasks(df,render_object,uuid):
    cols = render_object.columns([4,1])

    for index, row in df.iterrows():
        if(st.session_state.tasks_dict[index]["status"] == "Completed"):
            temp_value = True
        else:
            temp_value = False
        
        with cols[0]:
            state_of_task = st.checkbox(row["task"],value=temp_value,key=row["task"]+uuid)
    
            if(state_of_task):
                st.session_state.tasks_dict[index]["status"] = "Completed"
                if(temp_value != state_of_task):
                    st.session_state.tasks_dict[index]["finished_at"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


                # print("setting ",row["task"]," to complete")
            else:
                st.session_state.tasks_dict[index]["status"] = "Not Completed"

                # print("setting ",row["task"]," to not complete")
        with cols[1]:
            st.write(row["priority"]*"🔥")

def display_tasks():

    groups = st.session_state.tasks_df.group.unique()

    for group in groups:
        temp_df = st.session_state.tasks_df[st.session_state.tasks_df["group"]==group]

        with st.expander(group):
            display_df_of_tasks(temp_df,st,"group_tasks")


    print("Updating DF from displayed tasks")
    st.session_state.tasks_df = dict_to_dataframe(st.session_state.tasks_dict)

def display_today_tasks():

    st.title("Today at a glance")

    cols = st.columns([5,2])

    with cols[0]:
        st.header("Must Finish Today")
        display_df_of_tasks(st.session_state.tasks_df[st.session_state.tasks_df["priority"]==3],st,"priority_list")

    with cols[1]:
        st.header("Progress")

        st.write("Tasks ",len(st.session_state.tasks_df))
        st.write("Completed ",len(st.session_state.tasks_df[st.session_state.tasks_df["status"]=="Completed"]))

    print("Updating DF from displayed tasks")
    st.session_state.tasks_df = dict_to_dataframe(st.session_state.tasks_dict)

    status_of_one_df(st.session_state.tasks_df[st.session_state.tasks_df["priority"]==3],"Tasks for Today",st)
