import ClassUserLog from "./ClassUserLog";

function Report({ classLogs }) {
    return (
        <>
            <h2>Class - {classLogs.number}</h2>
            <p>Started at {new Date(classLogs.started_at).toLocaleString()}</p>
            <p>
                {" "}
                Ended at{" "}
                {classLogs.ended_at
                    ? new Date(classLogs.ended_at).toLocaleString()
                    : ""}
            </p>
            <p> {classLogs.is_active ? "In progress" : "Finished"}</p>
            <ClassUserLog userLogs={classLogs["logs"]} />
        </>
    );
}

export default Report;
