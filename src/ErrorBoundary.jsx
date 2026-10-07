import React from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/config'; //  المسار الصحيح

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error, errorInfo) {
    console.error('الخطأ:', error);
    console.error('مكان الخطأ:', errorInfo);

    try {
      const errorId = `ERR-${Date.now()}`;

      await addDoc(collection(db, 'error_logs'), {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        time: serverTimestamp()
      });

      this.setState({ errorId });
    } catch (e) {
      console.error('فشل تسجيل الخطأ في Firestore:', e);
    }
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  retryRender = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
      showDetails: false
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'Cairo',
            direction: 'rtl',
            background: '#0b0823',
            color: '#dcd4f5',
            minHeight: '100vh'
          }}
        >
          <h2 style={{ color: '#7b29d5' }}> حدث خطأ غير متوقع</h2>

          <p
            style={{
              color: '#7a1426',
              background: '#f6d9df',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}
          >
            {this.state.error?.message || 'حدث خطأ غير معروف'}
          </p>

          {this.state.errorId && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              رقم الخطأ: <strong>{this.state.errorId}</strong>
            </p>
          )}

          <button
            onClick={this.toggleDetails}
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              background: '#7b29d5',
              color: '#0a071e',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            {this.state.showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </button>

          {this.state.showDetails && (
            <pre
              style={{
                textAlign: 'left',
                maxHeight: 250,
                overflow: 'auto',
                background: '#0f0b2f',
                padding: 10,
                marginTop: '1rem',
                borderRadius: '8px',
                color: '#dcd4f5'
              }}
            >
              {this.state.error?.stack}
            </pre>
          )}

          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={this.retryRender}
              style={{
                padding: '0.8rem 1.5rem',
                cursor: 'pointer',
                background: '#3a1496',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                marginRight: '10px'
              }}
            >
              إعادة المحاولة
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.8rem 1.5rem',
                cursor: 'pointer',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;