

import { useState, Suspense, useCallback, useEffect } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { FilterLayout } from "@/components/filters/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTabs, CustomTabsContent, CustomTabsList, CustomTabsTrigger } from "@/components/app/CustomTabs";

function Form7PopupContent() {
  const searchParams = useSearchParams();
  // 발급번호
  const [issueNumber1, setIssueNumber1] = useState("");
  const [issueNumber2, setIssueNumber2] = useState("");

  // 필터 데이터
  const [filters, setFilters] = useState<Record<string, any>>({
    // 고객대상자
    customerName: "",
    customerResidentNumber: "",
    customerAddress: "",
    // 신청정보
    processingType: "",
    purpose: "",
    submissionPlace: "",
    viewReasonType: "",
    reasonContent: "",
    // 방문자정보
    visitorName: "",
    visitorResidentNumber: "",
    visitorPosition: "",
    visitorPhoneNumber: "",
  });

  // 탭 선택 (URL 파라미터에서 초기값 가져오기)
  const initialTab = searchParams.get("tab") === "form10" ? "form10" : "form7";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // 열람 필터
  const [certificateTypeSelect, setCertificateTypeSelect] = useState("");
  const [transcriptTypeSelect, setTranscriptTypeSelect] = useState("");

  // 통 수
  const [certificateCount, setCertificateCount] = useState("");
  const [transcriptCount, setTranscriptCount] = useState("");

  // 제10호서식 - 열람
  const [form10ViewTranscript, setForm10ViewTranscript] = useState(false);

  // 제10호서식 - 통 수
  const [form10TranscriptCount, setForm10TranscriptCount] = useState("");

  // 제10호서식 - 초본 항목
  const [form10TranscriptItems, setForm10TranscriptItems] = useState({
    personalInfoChangeHistory: "포함",
    pastAddressChange: "전체포함",
  });

  // 제10호서식 - 이해관계내용 (필터에 통합)
  const handleForm10FilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 등본 교부 항목들
  const [certificateItems, setCertificateItems] = useState({
    pastAddress: "포함",
    pastAddressRecent: false,
    householdComposition: "포함",
    householdCompositionDate: "포함",
    birthDate: "포함",
    changeReason: "포함",
    changeReasonHousehold: false,
    changeReasonIndividual: false,
    otherMemberNames: "포함",
    otherMemberNumbers: "포함",
    otherMemberNumbersSelf: false,
    otherMemberNumbersFamily: false,
    householdRelation: "포함",
    registryNote: "포함",
  });

  // 초본 교부 항목들
  const [transcriptItems, setTranscriptItems] = useState({
    personalInfoChange: "포함",
    pastAddressHistory: "관계포함",
    pastAddressHistoryRecent: false,
    householdInfoAndRelation: "포함",
    residentNumberChangeHistory: "포함",
    householdHeadNameAndRelation: "포함",
    birthDateAndAge: "포함",
    changeReason: "포함",
    militaryService: "포함",
    militaryServiceBasic: false,
    militaryServiceAll: false,
    domesticResidenceNumber: "포함",
  });

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const popupActions: PopupAction[] = [
    { id: "search", text: "조회" },
    { id: "process", text: "처리" },
    { id: "reinput", text: "재입력" },
    { id: "print", text: "출력" },
  ];

  // 필터 레이아웃 01: 고객대상자
  const customerTargetLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "customerName", type: "text", label: "고객명" },
        { name: "customerResidentNumber", type: "text", label: "주민등록번호" },
        { name: "customerAddress", type: "text", label: "주소" },
      ],
    },
  ];

  // 필터 레이아웃 02: 신청정보
  const applicationInfoLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "processingType", type: "select", label: "처리구분", options: [] },
        { name: "purpose", type: "text", label: "용도 및 목적" },
        { name: "submissionPlace", type: "text", label: "제출처" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "viewReasonType", type: "select", label: "열람사유구분", options: [] },
        { name: "reasonContent", type: "text", label: "사유내용", colSpan: 2 },
      ],
    },
  ];

  // 필터 레이아웃 03: 방문자정보
  const visitorInfoLayout: FilterLayout = [
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "visitorName", type: "text", label: "성명" },
        { name: "visitorResidentNumber", type: "text", label: "주민등록번호" },
        { name: "visitorBlank1", type: "blank" },
      ],
    },
    {
      type: "grid",
      columns: 3,
      filters: [
        { name: "visitorPosition", type: "text", label: "직급" },
        { name: "visitorPhoneNumber", type: "text", label: "전화번호" },
        { name: "visitorBlank2", type: "blank" },
      ],
    },
  ];

  // 필터 레이아웃 04: 이해관계내용 (제10호서식)
  const form10RelationInfoLayout: FilterLayout = [
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "form10IssueDate", type: "date", label: "변제기일" },
        { name: "form10DebtAmount", type: "text", label: "채무금액" },
      ],
    },
    {
      type: "grid",
      columns: 2,
      filters: [
        { name: "form10DebtContent", type: "text", label: "채무금 내용" },
        { name: "form10Etc", type: "text", label: "기타" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b shrink-0">
        <h2 className="text-xl font-bold">주민등록표 열람 또는 등·초본 교부 신청서</h2>
        <PopupRightActions actions={popupActions} />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        {/* 0. 발급번호 */}
        <div className="flex justify-end items-center gap-1.5">
          <span className="text-xs">발급번호: 제</span>
          <Input
            value={issueNumber1}
            onChange={(e) => setIssueNumber1(e.target.value)}
            className="w-12 h-7 text-xs"
          />
          <span className="text-xs">-</span>
          <Input
            value={issueNumber2}
            onChange={(e) => setIssueNumber2(e.target.value)}
            className="w-12 h-7 text-xs"
          />
          <span className="text-xs">호</span>
        </div>

        {/* 1. 필터 레이아웃 01: 고객대상자 */}
        <div>
          <h3 className="text-sm font-medium mb-2">고객대상자</h3>
          <FilterContainer
            filterLayout={customerTargetLayout}
            values={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* 2. 필터 레이아웃 02: 신청정보 */}
        <div>
          <h3 className="text-sm font-medium mb-2">신청정보</h3>
          <FilterContainer
            filterLayout={applicationInfoLayout}
            values={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* 3. 필터 레이아웃 03: 방문자정보 */}
        <div>
          <h3 className="text-sm font-medium mb-2">방문자정보</h3>
          <FilterContainer
            filterLayout={visitorInfoLayout}
            values={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* 4. 탭 레이아웃 */}
        <div>
          <CustomTabs value={selectedTab} onValueChange={setSelectedTab}>
            <CustomTabsList>
              <CustomTabsTrigger value="form7">제7호서식</CustomTabsTrigger>
              <CustomTabsTrigger value="form10">제10호서식</CustomTabsTrigger>
            </CustomTabsList>

            <CustomTabsContent value="form7" className="space-y-6 mt-4">
              {/* 열람 필터 */}
              <div>
                <h4 className="text-sm font-medium mb-2">열람</h4>
                <div className="bg-white p-4 rounded-lg border space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="w-24 text-sm font-medium">등본사항</Label>
                      <Select
                        value={certificateTypeSelect}
                        onValueChange={setCertificateTypeSelect}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">옵션1</SelectItem>
                          <SelectItem value="option2">옵션2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-24 text-sm font-medium">초본사항</Label>
                      <Select
                        value={transcriptTypeSelect}
                        onValueChange={setTranscriptTypeSelect}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">옵션1</SelectItem>
                          <SelectItem value="option2">옵션2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    ※ 등본 및 초본사항 선택시 하단의 입력내용 활성화
                  </p>
                </div>
              </div>

              {/* 안내 문구 */}
              <div className="bg-gray-50 border rounded p-4 text-sm">
                <p className="mb-1">
                  ※ 개인정보 보호를 위하여 아래 등·초본 사항 중 필요한 사항만 선택하여 신청할 수 있습니다.
                </p>
                <p>
                  선택사항을 표시하지 않는 경우에는 <strong>"포함"</strong>으로 굵게 표시된 사항만 포함하여 교부해드립니다.
                </p>
              </div>

              {/* 등본 교부 테이블 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">등본 교부</h4>
                  <span className="text-sm">[</span>
                  <Input
                    value={certificateCount}
                    onChange={(e) => setCertificateCount(e.target.value)}
                    className="w-16 h-7 text-sm"
                  />
                  <span className="text-sm">통]</span>
                </div>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {/* 1번 항목 - 전체 행 차지 */}
                      <tr className="border-b">
                        <td className="p-3 w-12 text-center">1.</td>
                        <td className="p-3 w-100">
                          <span className="font-medium">과거의 주소변동 사항</span>
                        </td>
                        <td className="p-3" colSpan={4}>
                          <div className="flex items-center gap-4">
                            <RadioGroup
                              value={certificateItems.pastAddress}
                              onValueChange={(value) =>
                                setCertificateItems((prev) => ({ ...prev, pastAddress: value }))
                              }
                              className="!flex !flex-row gap-4"
                            >
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="포함" id="past-addr-include" />
                                <Label htmlFor="past-addr-include" className="text-sm cursor-pointer">
                                  전체포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="미포함" id="past-addr-exclude" />
                                <Label htmlFor="past-addr-exclude" className="text-sm cursor-pointer">
                                  미포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="적정입력" id="past-addr-custom" />
                                <Label htmlFor="past-addr-custom" className="text-sm cursor-pointer">
                                  적정입력
                                </Label>
                              </div>
                            </RadioGroup>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="past-addr-recent"
                                checked={certificateItems.pastAddressRecent}
                                onCheckedChange={(checked) =>
                                  setCertificateItems((prev) => ({ ...prev, pastAddressRecent: checked as boolean }))
                                }
                              />
                              <Label htmlFor="past-addr-recent" className="text-sm cursor-pointer">
                                최근
                              </Label>
                            </div>
                          </div>
                        </td>
                      </tr>

                      <tr className="border-b">
                        <td className="p-3 w-12 text-center">2.</td>
                        <td className="p-3 w-100">세대 구성 사유</td>
                        <td className="p-3">
                          <RadioGroup
                            value={certificateItems.householdComposition}
                            onValueChange={(value) =>
                              setCertificateItems((prev) => ({ ...prev, householdComposition: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="household-include" />
                              <Label htmlFor="household-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="household-exclude" />
                              <Label htmlFor="household-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 w-12 text-center border-l">6.</td>
                        <td className="p-3 w-100">교부 대상자 외 세대, 세대원, 외국인등의 이름</td>
                        <td className="p-3">
                          <RadioGroup
                            value={certificateItems.otherMemberNames}
                            onValueChange={(value) =>
                              setCertificateItems((prev) => ({ ...prev, otherMemberNames: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="other-names-include" />
                              <Label htmlFor="other-names-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="other-names-exclude" />
                              <Label htmlFor="other-names-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>

                      <tr className="border-b">
                        <td className="p-3 text-center">3.</td>
                        <td className="p-3 w-100">세대 구성 일자</td>
                        <td className="p-3">
                          <RadioGroup
                            value={certificateItems.householdCompositionDate}
                            onValueChange={(value) =>
                              setCertificateItems((prev) => ({ ...prev, householdCompositionDate: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="composition-date-include" />
                              <Label htmlFor="composition-date-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="composition-date-exclude" />
                              <Label htmlFor="composition-date-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center border-l">7.</td>
                        <td className="p-3 w-100">주민등록번호 뒷자리</td>
                        <td className="p-3">
                          <div className="flex items-center gap-4">
                            <RadioGroup
                              value={certificateItems.otherMemberNumbers}
                              onValueChange={(value) =>
                                setCertificateItems((prev) => ({ ...prev, otherMemberNumbers: value }))
                              }
                              className="!flex !flex-row gap-4"
                            >
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="포함" id="other-numbers-include" />
                                <Label htmlFor="other-numbers-include" className="text-sm cursor-pointer">
                                  포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="미포함" id="other-numbers-exclude" />
                                <Label htmlFor="other-numbers-exclude" className="text-sm cursor-pointer">
                                  미포함
                                </Label>
                              </div>
                            </RadioGroup>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="other-numbers-self"
                                checked={certificateItems.otherMemberNumbersSelf}
                                onCheckedChange={(checked) =>
                                  setCertificateItems((prev) => ({ ...prev, otherMemberNumbersSelf: checked as boolean }))
                                }
                              />
                              <Label htmlFor="other-numbers-self" className="text-sm cursor-pointer">
                                본인
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="other-numbers-family"
                                checked={certificateItems.otherMemberNumbersFamily}
                                onCheckedChange={(checked) =>
                                  setCertificateItems((prev) => ({ ...prev, otherMemberNumbersFamily: checked as boolean }))
                                }
                              />
                              <Label htmlFor="other-numbers-family" className="text-sm cursor-pointer">
                                세대원
                              </Label>
                            </div>
                          </div>
                        </td>
                      </tr>

                      <tr className="border-b">
                        <td className="p-3 text-center">4.</td>
                        <td className="p-3 w-100">발생일 / 신고일</td>
                        <td className="p-3">
                          <RadioGroup
                            value={certificateItems.birthDate}
                            onValueChange={(value) =>
                              setCertificateItems((prev) => ({ ...prev, birthDate: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="birth-include" />
                              <Label htmlFor="birth-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="birth-exclude" />
                              <Label htmlFor="birth-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center border-l">8.</td>
                        <td className="p-3 w-100">세대원의 세대 주와의 관계</td>
                        <td className="p-3">
                          <RadioGroup
                            value={certificateItems.householdRelation}
                            onValueChange={(value) =>
                              setCertificateItems((prev) => ({ ...prev, householdRelation: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="relation-include" />
                              <Label htmlFor="relation-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="relation-exclude" />
                              <Label htmlFor="relation-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 text-center">5.</td>
                        <td className="p-3 w-100">변동 사유</td>
                        <td className="p-3">
                          <div className="flex items-center gap-4">
                            <RadioGroup
                              value={certificateItems.changeReason}
                              onValueChange={(value) =>
                                setCertificateItems((prev) => ({ ...prev, changeReason: value }))
                              }
                              className="!flex !flex-row gap-4"
                            >
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="포함" id="change-reason-include" />
                                <Label htmlFor="change-reason-include" className="text-sm cursor-pointer">
                                  포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="미포함" id="change-reason-exclude" />
                                <Label htmlFor="change-reason-exclude" className="text-sm cursor-pointer">
                                  미포함
                                </Label>
                              </div>
                            </RadioGroup>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="change-reason-household"
                                checked={certificateItems.changeReasonHousehold}
                                onCheckedChange={(checked) =>
                                  setCertificateItems((prev) => ({ ...prev, changeReasonHousehold: checked as boolean }))
                                }
                              />
                              <Label htmlFor="change-reason-household" className="text-sm cursor-pointer">
                                세대
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="change-reason-individual"
                                checked={certificateItems.changeReasonIndividual}
                                onCheckedChange={(checked) =>
                                  setCertificateItems((prev) => ({ ...prev, changeReasonIndividual: checked as boolean }))
                                }
                              />
                              <Label htmlFor="change-reason-individual" className="text-sm cursor-pointer">
                                개인별
                              </Label>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center border-l">9.</td>
                        <td className="p-3 w-100">동거인</td>
                        <td className="p-3">
                          <RadioGroup
                            value={certificateItems.registryNote}
                            onValueChange={(value) =>
                              setCertificateItems((prev) => ({ ...prev, registryNote: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="registry-include" />
                              <Label htmlFor="registry-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="registry-exclude" />
                              <Label htmlFor="registry-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 초본 교부 테이블 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">초본 교부</h4>
                  <span className="text-sm">[</span>
                  <Input
                    value={transcriptCount}
                    onChange={(e) => setTranscriptCount(e.target.value)}
                    className="w-16 h-7 text-sm"
                  />
                  <span className="text-sm">통]</span>
                </div>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full text-sm table-fixed">
                    <tbody>
                      {/* 1번과 6번 항목 */}
                      <tr className="border-b">
                        <td className="p-3 w-12 text-center">1.</td>
                        <td className="p-3 w-100">개인 인적사항의 변동 내용</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.personalInfoChange}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, personalInfoChange: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="personal-info-include" />
                              <Label htmlFor="personal-info-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="personal-info-exclude" />
                              <Label htmlFor="personal-info-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 w-12 text-center border-l">6.</td>
                        <td className="p-3 w-100">발생일 / 신고일</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.birthDateAndAge}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, birthDateAndAge: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="transcript-birth-include" />
                              <Label htmlFor="transcript-birth-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="transcript-birth-exclude" />
                              <Label htmlFor="transcript-birth-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>

                      {/* 2번 항목 - 전체 행 차지 */}
                      <tr className="border-b">
                        <td className="p-3 w-12 text-center">2.</td>
                        <td className="p-3 w-100">과거의 주소변동 사항</td>
                        <td className="p-3" colSpan={4}>
                          <div className="flex items-center gap-4">
                            <RadioGroup
                              value={transcriptItems.pastAddressHistory}
                              onValueChange={(value) =>
                                setTranscriptItems((prev) => ({ ...prev, pastAddressHistory: value }))
                              }
                              className="!flex !flex-row gap-4"
                            >
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="관계포함" id="transcript-addr-relation" />
                                <Label htmlFor="transcript-addr-relation" className="text-sm cursor-pointer">
                                  관계포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="미포함" id="transcript-addr-exclude" />
                                <Label htmlFor="transcript-addr-exclude" className="text-sm cursor-pointer">
                                  미포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="직접입력" id="transcript-addr-custom" />
                                <Label htmlFor="transcript-addr-custom" className="text-sm cursor-pointer">
                                  직접입력
                                </Label>
                              </div>
                            </RadioGroup>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="past-addr-recent-transcript"
                                checked={transcriptItems.pastAddressHistoryRecent}
                                onCheckedChange={(checked) =>
                                  setTranscriptItems((prev) => ({ ...prev, pastAddressHistoryRecent: checked as boolean }))
                                }
                              />
                              <Label htmlFor="past-addr-recent-transcript" className="text-sm cursor-pointer">
                                최근 포함
                              </Label>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* 3번과 7번 항목 */}
                      <tr className="border-b">
                        <td className="p-3 text-center">3.</td>
                        <td className="p-3 w-100">과거의 주소변동 사항 중 세대주의 성명과 세대주와의 관계</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.householdInfoAndRelation}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, householdInfoAndRelation: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="household-info-include" />
                              <Label htmlFor="household-info-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="household-info-exclude" />
                              <Label htmlFor="household-info-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center border-l">7.</td>
                        <td className="p-3 w-100">변동 사유</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.changeReason}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, changeReason: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="transcript-change-include" />
                              <Label htmlFor="transcript-change-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="transcript-change-exclude" />
                              <Label htmlFor="transcript-change-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>

                      {/* 4번과 8번 항목 */}
                      <tr className="border-b">
                        <td className="p-3 text-center">4.</td>
                        <td className="p-3 w-100">주민등록번호 변경이력</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.residentNumberChangeHistory}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, residentNumberChangeHistory: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="resident-change-include" />
                              <Label htmlFor="resident-change-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="resident-change-exclude" />
                              <Label htmlFor="resident-change-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center border-l">8.</td>
                        <td className="p-3 w-100">병역 사항</td>
                        <td className="p-3">
                          <div className="flex items-center gap-4">
                            <RadioGroup
                              value={transcriptItems.militaryService}
                              onValueChange={(value) =>
                                setTranscriptItems((prev) => ({ ...prev, militaryService: value }))
                              }
                              className="!flex !flex-row gap-4"
                            >
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="포함" id="military-include" />
                                <Label htmlFor="military-include" className="text-sm cursor-pointer">
                                  포함
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <RadioGroupItem value="미포함" id="military-exclude" />
                                <Label htmlFor="military-exclude" className="text-sm cursor-pointer">
                                  미포함
                                </Label>
                              </div>
                            </RadioGroup>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="military-basic"
                                checked={transcriptItems.militaryServiceBasic}
                                onCheckedChange={(checked) =>
                                  setTranscriptItems((prev) => ({ ...prev, militaryServiceBasic: checked as boolean }))
                                }
                              />
                              <Label htmlFor="military-basic" className="text-sm cursor-pointer">
                                기본(입영, 전역일)
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="military-all"
                                checked={transcriptItems.militaryServiceAll}
                                onCheckedChange={(checked) =>
                                  setTranscriptItems((prev) => ({ ...prev, militaryServiceAll: checked as boolean }))
                                }
                              />
                              <Label htmlFor="military-all" className="text-sm cursor-pointer">
                                전체
                              </Label>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* 5번과 9번 항목 */}
                      <tr>
                        <td className="p-3 text-center">5.</td>
                        <td className="p-3 w-100">세대 주의 성명과 세대 주와의 관계</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.householdHeadNameAndRelation}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, householdHeadNameAndRelation: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="household-head-include" />
                              <Label htmlFor="household-head-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="household-head-exclude" />
                              <Label htmlFor="household-head-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center border-l">9.</td>
                        <td className="p-3 w-100">국내거소신고번호 / 외국인등록번호</td>
                        <td className="p-3">
                          <RadioGroup
                            value={transcriptItems.domesticResidenceNumber}
                            onValueChange={(value) =>
                              setTranscriptItems((prev) => ({ ...prev, domesticResidenceNumber: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="domestic-include" />
                              <Label htmlFor="domestic-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="domestic-exclude" />
                              <Label htmlFor="domestic-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="form10" className="space-y-6 mt-4">
              {/* 열람 */}
              <div>
                <h4 className="text-sm font-medium mb-2">열람</h4>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="form10-view-transcript"
                      checked={form10ViewTranscript}
                      onCheckedChange={(checked) => setForm10ViewTranscript(checked as boolean)}
                    />
                    <Label htmlFor="form10-view-transcript" className="text-sm cursor-pointer">
                      초본사항
                    </Label>
                  </div>
                </div>
              </div>

              {/* 안내 문구 */}
              <div className="bg-gray-50 border rounded p-4 text-sm">
                <p>※ 아래의 초본사항 중 필요한 항목이 있는 경우에는 표시하여야 합니다.</p>
              </div>

              {/* 초본 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">초본</h4>
                  <span className="text-sm">[</span>
                  <Input
                    value={form10TranscriptCount}
                    onChange={(e) => setForm10TranscriptCount(e.target.value)}
                    className="w-16 h-7 text-sm"
                  />
                  <span className="text-sm">통]</span>
                </div>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 w-12 text-center">1.</td>
                        <td className="p-3 w-180">개인인적사항 변경내역</td>
                        <td className="p-3">
                          <RadioGroup
                            value={form10TranscriptItems.personalInfoChangeHistory}
                            onValueChange={(value) =>
                              setForm10TranscriptItems((prev) => ({ ...prev, personalInfoChangeHistory: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="포함" id="form10-personal-include" />
                              <Label htmlFor="form10-personal-include" className="text-sm cursor-pointer">
                                포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="form10-personal-exclude" />
                              <Label htmlFor="form10-personal-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 text-center">2.</td>
                        <td className="p-3 w-180">과거의 주소변동사항</td>
                        <td className="p-3">
                          <RadioGroup
                            value={form10TranscriptItems.pastAddressChange}
                            onValueChange={(value) =>
                              setForm10TranscriptItems((prev) => ({ ...prev, pastAddressChange: value }))
                            }
                            className="!flex !flex-row gap-4"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="전체포함" id="form10-addr-all" />
                              <Label htmlFor="form10-addr-all" className="text-sm cursor-pointer">
                                전체포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="최근5년포함" id="form10-addr-recent" />
                              <Label htmlFor="form10-addr-recent" className="text-sm cursor-pointer">
                                최근 5년 포함
                              </Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="미포함" id="form10-addr-exclude" />
                              <Label htmlFor="form10-addr-exclude" className="text-sm cursor-pointer">
                                미포함
                              </Label>
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 이해관계내용 */}
              <div>
                <h4 className="text-sm font-medium mb-2">이해관계내용</h4>
                <FilterContainer
                  filterLayout={form10RelationInfoLayout}
                  values={filters}
                  onChange={handleForm10FilterChange}
                />
              </div>
            </CustomTabsContent>
          </CustomTabs>
        </div>
      </div>
    </div>
  );
}

export default function Form7PopupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form7PopupContent />
    </Suspense>
  );
}
