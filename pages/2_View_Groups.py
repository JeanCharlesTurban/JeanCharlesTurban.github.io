import streamlit as st


from helperfunctions.display_tasks import *
from helperfunctions.reader_writers import *



display_tasks()
side_bar_group_status()


print("Updating CSV")
csv_database_handler()

## SAVE TXT
print("Write DF to file")
write_task_to_text(st.session_state.tasks_df)