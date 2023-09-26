import streamlit as st

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

def edit_txt_file_directly():


    # edited_text = st.text_area("Edit File", st.session_state.file, height=600)
    edited_df = st.data_editor(st.session_state.tasks_df,height=900)

    if st.sidebar.button("Save changes"):
        st.session_state.tasks_df = edited_df
        with st.spinner("Saving File"):
            write_task_to_text(st.session_state.tasks_df)

st.title("Edit Tasks Directly")
edit_txt_file_directly()
