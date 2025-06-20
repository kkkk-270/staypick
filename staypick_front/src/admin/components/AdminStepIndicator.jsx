import React from 'react'

const AdminStepIndicator = ({step}) => {
    const steps = ['약관 동의', '정보 입력', '가입 완료'];
    return (
        <div className="register-steps">
            {steps.map((label, index) => (
                <div
                    key={index}
                    className={`step ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''}`}
                >
                    <div>{index + 1}. {label}</div>
                </div>
            ))}
        </div>
    )
}

export default AdminStepIndicator