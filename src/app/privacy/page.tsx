export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 prose prose-stone">
            <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>

            <p className="text-gray-600 mb-8">
                &apos;웨딩 청첩장 빌더&apos;(이하 &apos;서비스&apos;)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여,
                적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1. 개인정보의 수집 및 이용 목적</h3>
            <p>서비스는 다음의 목적을 위해 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
                <li><strong>회원 가입 및 관리:</strong> 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의여부 확인, 각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.</li>
                <li><strong>서비스 제공:</strong> 청첩장 생성 및 유지, 서비스 불만 처리 등 원활한 서비스 운영을 위해 활용됩니다.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">2. 수집하는 개인정보의 항목</h3>
            <p>서비스는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <div className="bg-gray-50 p-4 rounded-lg my-4 border border-gray-200 text-gray-900">
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>필수 수집 항목:</strong> 카카오 계정(ID), 휴대폰 번호</li>
                    <li><strong>수집 목적:</strong> <span className="text-red-600 font-bold">중복 가입 방지 및 실제 사용자 확인</span></li>
                </ul>
            </div>
            <p className="text-sm text-gray-500">
                * 카카오 로그인 시 제공되는 정보 중 &apos;휴대폰 번호&apos;는 부정 이용 방지 및 1인 1계정 원칙 준수를 위한 본인 확인 용도로만 사용되며, 마케팅 목적으로 활용되지 않습니다.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">3. 개인정보의 보유 및 이용 기간</h3>
            <p>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>
            <ul className="list-disc pl-5 space-y-2 my-4">
                <li>보존 항목: 카카오 계정 고유 ID, 휴대폰 번호 (암호화하여 저장)</li>
                <li>보존 근거: 서비스 부정 이용 방지 및 중복 가입 제한</li>
                <li>보존 기간: 회원 탈퇴 시 즉시 파기 (단, 부정이용 기록이 있는 경우 탈퇴 후 1년간 보관)</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">4. 동의 거부 권리</h3>
            <p>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 단, 필수 수집 항목(휴대폰 번호 등)에 대한 동의를 거부할 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.</p>

            <hr className="my-12 border-gray-200" />
            <p className="text-sm text-gray-400">시행일자: 2024년 1월 1일</p>
        </div>
    );
}
