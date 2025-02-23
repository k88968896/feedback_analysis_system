import "../styles/Table.css";

const Table = ({ columns, data, actions }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                        {actions && <th>操作</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)}>沒有資料</td>
                        </tr>
                    ) : (
                        data.map((item, index) => {
                            const { _id, ...displayData } = item; // 移除 _id，不顯示在表格
                            return (
                                <tr key={index}>
                                    {Object.values(displayData).map((value, i) => (
                                        <td key={i}>{value}</td>
                                    ))}
                                    {actions && (
                                        <td>
                                            {actions.map((action, i) => (
                                                <button key={i} onClick={() => action.onClick(item)}>
                                                    {action.label}
                                                </button>
                                            ))}
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
