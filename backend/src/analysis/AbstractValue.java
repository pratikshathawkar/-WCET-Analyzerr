package analysis;

public class AbstractValue {

    private int lower;
    private int upper;

    public AbstractValue(int lower, int upper) {
        this.lower = lower;
        this.upper = upper;
    }

    public int getLower() {
        return lower;
    }

    public int getUpper() {
        return upper;
    }

    public void setUpper(int upper) {
        this.upper = upper;
    }

    @Override
    public String toString() {
        return "[" + lower + ", " + upper + "]";
    }
}