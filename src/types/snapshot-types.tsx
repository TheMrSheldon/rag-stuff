
interface Answer {
    citations: number[]
    text: string
}

interface SnapshotData {
    answer: Answer[];
    topic: string;
    topicid: string;
    version: string;
    raw_text: string;
    references: string[]
}

interface Snapshot {
    timestamp: string;
    topic: string;
    user: string;
    data: SnapshotData;
}
