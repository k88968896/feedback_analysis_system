import { Table as BootstrapTable, Button, ButtonGroup, Alert } from "react-bootstrap";

const Table = ({ columns, data, actions }) => {
    return (
        <div className="table-responsive">
            <BootstrapTable striped bordered hover className="align-middle">
                <thead className="table-dark">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                        {actions && <th className="text-center">操作</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)}>
                                <Alert variant="info" className="m-0 text-center">
                                    沒有資料
                                </Alert>
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => {
                            const { _id, ...displayData } = item;
                            return (
                                <tr key={index}>
                                    {Object.values(displayData).map((value, i) => (
                                        <td key={i} className="py-3">{value}</td>
                                    ))}
                                    {actions && (
                                        <td className="text-center">
                                            <ButtonGroup aria-label="Basic example">
                                                {actions.map((action, i) => (
                                                    <Button
                                                        key={i}
                                                        variant={i === actions.length - 1 ? "danger" : "primary"}
                                                        size="sm"
                                                        className="mx-1"
                                                        onClick={() => action.onClick(item)}
                                                    >
                                                        {action.label}
                                                    </Button>
                                                ))}
                                            </ButtonGroup>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </BootstrapTable>
        </div>
    );
};

export default Table;
