const Loading = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative">
                <div
                    className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-700 
                      rounded-full animate-spin`}
                />
                <div
                    className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent 
                      border-t-secondary-500 rounded-full animate-spin opacity-50`}
                    style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
                />
            </div>
            {text && (
                <p className={`mt-4 text-gray-600 font-medium ${textSizeClasses[size]}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loading;
