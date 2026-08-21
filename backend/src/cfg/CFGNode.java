 package cfg;

public class CFGNode {

    private int id;
    private String statement;

    public CFGNode(int id, String statement) {
        this.id = id;
        this.statement = statement;
    }

    public int getId() {
        return id;
    }

    public String getStatement() {
        return statement;
    }

    @Override
    public String toString() {
        return "Node " + id + ": " + statement;
    }
}