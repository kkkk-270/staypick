import React, { useState, useEffect } from 'react';

const AdminAgreement = ({ onAgreementChange, onPrivacyChange, onBizTermsChange }) => {
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [bizTermsChecked, setBizTermsChecked] = useState(false);

    const allAgreed = agreementChecked && privacyChecked && bizTermsChecked;

    useEffect(() => {
        onAgreementChange?.(agreementChecked);
    }, [agreementChecked]);

    useEffect(() => {
        onPrivacyChange?.(privacyChecked);
    }, [privacyChecked]);

    useEffect(() => {
        onBizTermsChange?.(bizTermsChecked);
    }, [bizTermsChecked]);

    const handleAllAgree = (checked) => {
        setAgreementChecked(checked);
        setPrivacyChecked(checked);
        setBizTermsChecked(checked);
    };

    return (
        <div className="signUpPage">
            <h1>숙소 관리자 약관 동의</h1>

            <div className="terms-box">
                <div className="terms-section">
                    <h2>이용약관</h2>
                    <div className="terms-content scroll-box">
                        <h3>제1조 (목적)</h3>
                        <p>이 약관은 STAYPICK(이하 "회사")가 제공하는 숙소 관리 서비스의 이용과 관련하여 회사와 숙소 관리자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>

                        <h3>제2조 (정의)</h3>
                        <ul>
                        <li>"숙소 관리자"란 회사와 계약을 체결하고, 회사가 제공하는 플랫폼에 숙소를 등록·관리하는 사업자를 말합니다.</li>
                        <li>"플랫폼"이란 회사가 제공하는 웹사이트 및 모바일 앱을 포함한 온라인 시스템을 의미합니다.</li>
                        </ul>

                        <h3>제3조 (약관의 효력 및 변경)</h3>
                        <ol>
                        <li>이 약관은 숙소 관리자에게 적용됩니다.</li>
                        <li>회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 사전 고지합니다.</li>
                        </ol>

                        <h3>제4조 (회원가입 및 계약 체결)</h3>
                        <p>숙소 관리자는 실제 사업자 등록증 및 관련 서류를 제출하여야 하며, 회사의 승인을 받아야 합니다.</p>

                        <h3>제5조 (숙소 관리자의 의무)</h3>
                        <ol>
                        <li>정확한 숙소 정보 제공 및 업데이트 의무</li>
                        <li>예약, 취소, 환불에 대한 신속한 처리 의무</li>
                        <li>서비스 운영 방침 준수</li>
                        </ol>

                        <h3>제6조 (서비스 제한 및 해지)</h3>
                        <p>약관 위반 시 회사는 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.</p>

                        <h3>제7조 (면책조항)</h3>
                        <ul>
                        <li>천재지변, 시스템 장애 등 불가항력적 사유로 인한 손해에 대해 회사는 책임지지 않습니다.</li>
                        </ul>
                    </div>
                    <label className="agree-checkbox" htmlFor="agreeBizTerms">
                        <input
                            type="checkbox"
                            id="agreeBizTerms"
                            checked={agreementChecked}
                            onChange={(e) => setAgreementChecked(e.target.checked)}
                        />
                        이용약관에 동의합니다. (필수)
                    </label>
                </div>


                <div className="terms-section">
                    <h2>개인정보 수집 및 이용 동의</h2>
                    <div className="terms-content scroll-box">
                        <h3>1. 수집 항목</h3>
                        <ul>
                        <li>필수: 사업자명, 사업자등록번호, 대표자명, 이메일, 휴대전화, 주소, 통장사본, 신분증 사본</li>
                        <li>자동 수집: IP 주소, 브라우저 정보, 로그인 이력</li>
                        </ul>

                        <h3>2. 수집 목적</h3>
                        <ul>
                        <li>사업자 인증 및 계약 체결</li>
                        <li>정산 및 세무 처리</li>
                        <li>고객 문의 대응 및 민원 처리</li>
                        </ul>

                        <h3>3. 보유 및 이용 기간</h3>
                        <ul>
                        <li>회원 탈퇴 또는 계약 종료 시까지 보유</li>
                        <li>관련 법령에 따라 일정 기간 보관</li>
                        </ul>

                        <h3>4. 제3자 제공</h3>
                        <p>회사는 법적 의무에 따라 필요한 경우를 제외하고 외부에 개인정보를 제공하지 않습니다.</p>

                        <h3>5. 권리</h3>
                        <p>숙소 관리자는 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할 수 있습니다.</p>
                    </div>
                    <label className="agree-checkbox" htmlFor="agreeBizPrivacy">
                        <input
                            type="checkbox"
                            id="agreeBizPrivacy"
                            checked={privacyChecked}
                            onChange={(e) => setPrivacyChecked(e.target.checked)}
                        />
                        개인정보 수집 및 이용에 동의합니다. (필수)
                    </label>
                </div>


                <div className="terms-section">
                    <h2>숙소 관리자 전용 약관</h2>
                    <div className="terms-content scroll-box">
                        <h3>제1조 (등록 요건)</h3>
                        <p>숙소 관리자는 유효한 사업자등록증, 통장 사본, 신분증 사본 등을 제출해야 하며, 회사의 승인을 받아야 합니다.</p>

                        <h3>제2조 (숙소 정보의 정확성)</h3>
                        <p>숙소명, 주소, 가격, 사진 등은 사실과 일치해야 하며, 갱신 의무가 있습니다.</p>

                        <h3>제3조 (예약 및 환불 의무)</h3>
                        <ul>
                        <li>고객 예약에 대한 신속한 처리 의무</li>
                        <li>무응답 또는 일방적 취소 시 서비스 제한</li>
                        </ul>

                        <h3>제4조 (고객 응대 및 리뷰)</h3>
                        <ul>
                        <li>정중한 고객 응대 의무</li>
                        <li>리뷰 조작 금지 및 부당한 삭제 요청 금지</li>
                        </ul>

                        <h3>제5조 (정산 및 수수료)</h3>
                        <p>수수료는 사전 고지되며, 정산은 회사 정책에 따릅니다.</p>

                        <h3>제6조 (위반 시 조치)</h3>
                        <ul>
                        <li>경고, 숙소 노출 제한, 서비스 정지, 계약 해지 가능</li>
                        </ul>
                    </div>
                    <label className="agree-checkbox" htmlFor="agreeBizManagerTerms">
                        <input
                            type="checkbox"
                            id="agreeBizManagerTerms"
                            checked={bizTermsChecked}
                            onChange={(e) => setBizTermsChecked(e.target.checked)}
                        />
                        숙소 관리자 전용 약관에 동의합니다. (필수)
                    </label>
                </div>


                <label className="agree-checkbox all-agree">
                    <input
                        type="checkbox"
                        checked={agreementChecked && privacyChecked && bizTermsChecked}
                        onChange={(e) => handleAllAgree(e.target.checked)}
                    />
                    모든 약관에 동의합니다
                </label>
            </div>
        </div>
    );
};

export default AdminAgreement;
