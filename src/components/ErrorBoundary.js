import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { logError } from '../utils/errorLogger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error });
        try { logError(error, { info }); } catch (e) { console.error('ErrorBoundary log failed', e); }
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.message}>We captured the error and logged it for review.</Text>
                    <TouchableOpacity onPress={() => this.setState({ hasError: false, error: null })} style={styles.button}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    message: { fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 12 },
    button: { backgroundColor: 'rgba(20,52,164,1)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
    buttonText: { color: '#fff', fontWeight: '600' },
});

export default ErrorBoundary;
