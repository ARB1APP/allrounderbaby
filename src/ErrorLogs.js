import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { getLogs, clearLogs } from './utils/errorLogger';

const ErrorLogs = () => {
    const [logs, setLogs] = useState([]);

    const load = async () => {
        const items = await getLogs();
        setLogs(items);
    };

    useEffect(() => { load(); }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>App Error Logs</Text>
                <TouchableOpacity onPress={async () => { await clearLogs(); setLogs([]); }} style={styles.clearButton}><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
            </View>
            <FlatList
                data={logs}
                keyExtractor={(item, idx) => `${item.timestamp}-${idx}`}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.ts}>{item.timestamp}</Text>
                        <Text style={styles.msg}>{item.message}</Text>
                        {item.stack ? <Text style={styles.stack}>{item.stack}</Text> : null}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No logs recorded</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    title: { fontSize: 18, fontWeight: '700' },
    clearButton: { padding: 8, backgroundColor: '#e53935', borderRadius: 6 },
    clearText: { color: '#fff', fontWeight: '600' },
    item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    ts: { fontSize: 12, color: '#888' },
    msg: { marginTop: 6, fontSize: 14, color: '#111' },
    stack: { marginTop: 6, fontSize: 12, color: '#444' },
    empty: { padding: 16, textAlign: 'center', color: '#666' },
});

export default ErrorLogs;
