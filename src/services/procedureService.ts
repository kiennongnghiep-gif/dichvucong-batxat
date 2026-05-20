import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Procedure {
  id: string;
  name: string;
  targetAudience: string;
  location: string;
  documents: string[];
  duration: string;
  fee: string;
  steps: string[];
  notes: string;
  reference?: string;
  category: 'civil' | 'land' | 'agriculture' | 'social';
  keywords?: string[];
}

export const MOCK_PROCEDURES: Procedure[] = [
  {
    id: 'birth-registration',
    name: 'Đăng ký khai sinh',
    targetAudience: 'Cha, mẹ hoặc người thân thích của trẻ em mới sinh.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Tờ khai đăng ký khai sinh.',
      'Giấy chứng sinh.',
      'CCCD của cha, mẹ.',
      'Giấy chứng nhận kết hôn (nếu có).'
    ],
    duration: 'Trong ngày.',
    fee: 'Miễn phí đúng hạn.',
    steps: ['Nộp hồ sơ', 'Kiểm tra', 'Ký giấy', 'Trả kết quả'],
    notes: 'Nên làm trong 60 ngày sau sinh.',
    category: 'civil'
  },
  {
    id: 'marital-status',
    name: 'Xác nhận tình trạng hôn nhân',
    targetAudience: 'Công dân cư trú tại xã Bát Xát dùng để kết hôn hoặc mục đích khác.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Tờ khai theo mẫu.',
      'Trình bản chính CCCD.',
      'Bản án ly hôn (nếu đã ly hôn), Giấy khai tử (nếu vợ/chồng đã mất).'
    ],
    duration: '3 ngày làm việc.',
    fee: '15.000 đồng/bản.',
    steps: ['Gửi tờ khai', 'Công chức xác minh', 'Ký giấy xác nhận', 'Nhận kết quả'],
    notes: 'Giấy xác nhận có giá trị trong 6 tháng kể từ ngày cấp.',
    category: 'civil'
  },
  {
    id: 'death-registration',
    name: 'Đăng ký khai tử',
    targetAudience: 'Người thân của người đã mất.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Tờ khai đăng ký khai tử.',
      'Giấy báo tử hoặc giấy tờ thay thế.',
      'CCCD của người đi khai và người chết (nếu có).'
    ],
    duration: 'Trong ngày.',
    fee: 'Miễn phí đúng hạn.',
    steps: ['Gửi hồ sơ', 'Ghi sổ hộ tịch', 'Ký giấy khai tử', 'Nhận kết quả'],
    notes: 'Khai tử trong vòng 15 ngày kể từ ngày có người chết.',
    category: 'civil'
  },
  {
    id: 'signature-notary',
    name: 'Chứng thực chữ ký',
    targetAudience: 'Cá nhân có nhu cầu.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Bản chính CCCD.',
      'Giấy tờ, văn bản mà mình sẽ ký vào đó.'
    ],
    duration: 'Trong ngày.',
    fee: '10.000 đồng/trường hợp.',
    steps: ['Xuất trình giấy tờ', 'Ký trước mặt công chức', 'Đóng dấu chứng thực', 'Nhận kết quả'],
    notes: 'Người yêu cầu chứng thực phải hoàn toàn chịu trách nhiệm về nội dung văn bản mình ký.',
    category: 'civil'
  },
  {
    id: 'extract-copy',
    name: 'Cấp bản sao trích lục hộ tịch',
    targetAudience: 'Cá nhân có thông tin hộ tịch tại xã.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Tờ khai cấp bản sao trích lục.',
      'CCCD của người yêu cầu.'
    ],
    duration: 'Trong ngày.',
    fee: '8.000 đồng/bản sao.',
    steps: ['Gửi đơn', 'Kiểm tra sổ hộ tịch', 'Trích lục', 'Trả kết quả'],
    notes: 'Bản sao trích lục có giá trị sử dụng như bản chính trong các giao dịch.',
    category: 'civil'
  },
  {
    id: 'land-dispute',
    name: 'Hòa giải tranh chấp đất đai',
    targetAudience: 'Các bên có tranh chấp đất đai mà không tự hòa giải được.',
    location: 'Hội đồng hòa giải UBND xã Bát Xát.',
    documents: [
      'Đơn yêu cầu hòa giải tranh chấp đất đai.',
      'Các giấy tờ chứng minh quyền sử dụng đất.',
      'Các bằng chứng liên quan đến tranh chấp.'
    ],
    duration: 'Không quá 45 ngày kể từ ngày nhận đơn.',
    fee: 'Không thu phí hòa giải tại cấp xã.',
    steps: [
      'Nắm bắt đơn yêu cầu.',
      'Thẩm tra, xác minh nguồn gốc đất và hiện trạng.',
      'Thành lập Hội đồng hòa giải và tổ chức cuộc họp.',
      'Lập biên bản hòa giải (thành hoặc không thành).'
    ],
    notes: 'Hòa giải tại UBND xã là thủ tục bắt buộc trước khi khởi kiện tại Tòa án đối với tranh chấp ai là người có quyền sử dụng đất.',
    category: 'land'
  },
  {
    id: 'house-construction',
    name: 'Hướng dẫn xây dựng nhà ở',
    targetAudience: 'Chủ đầu tư xây dựng nhà ở riêng lẻ tại nông thôn.',
    location: 'Bộ phận Địa chính - Xây dựng UBND xã Bát Xát.',
    documents: [
      'Giấy chứng nhận quyền sử dụng đất.',
      'Bản vẽ sơ đồ thiết kế (nếu có).',
      'Đơn thông báo khởi công xây dựng.'
    ],
    duration: 'Trong ngày (đối với tư vấn, hướng dẫn).',
    fee: 'Miễn phí hướng dẫn.',
    steps: [
      'Liên hệ cán bộ địa chính xã.',
      'Cán bộ kiểm tra quy hoạch và chỉ giới đường đỏ.',
      'Hướng dẫn các biện pháp an toàn và vệ sinh.',
      'Thực hiện thông báo khởi công.'
    ],
    notes: 'Tại nông thôn, nhà ở dưới 7 tầng không thuộc khu di tích, quy hoạch đô thị thì được miễn giấy phép xây dựng nhưng phải thông báo khởi công.',
    category: 'land'
  },
  {
    id: 'land-origin-confirm',
    name: 'Xác nhận nguồn gốc đất',
    targetAudience: 'Cá nhân, hộ gia đình đang sử dụng đất.',
    location: 'Bộ phận Địa chính - Xây dựng, UBND xã Bát Xát.',
    documents: [
      'Đơn xin xác nhận nguồn gốc đất.',
      'Giấy tờ cũ liên quan (nếu có).',
      'Trích lục bản đồ địa chính.',
      'CCCD.'
    ],
    duration: 'Từ 10 - 15 ngày.',
    fee: 'Theo quy định phí thẩm định.',
    steps: ['Nộp đơn', 'Đo đạc xác minh', 'Niêm yết công khai', 'Ký xác nhận'],
    notes: 'Bà con cần kiểm tra thẩm quyền mới sau 01/7/2025 tại UBND xã.',
    category: 'land'
  },
  {
    id: 'notary-copy',
    name: 'Chứng thực bản sao từ bản chính',
    targetAudience: 'Mọi cá nhân có nhu cầu.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Bản chính giấy tờ, văn bản cần chứng thực.',
      'Bản photo từ bản chính (nếu không có máy photo tại xã).'
    ],
    duration: 'Giải quyết ngay trong ngày.',
    fee: '2.000 đồng/trang (tối đa 200.000 đồng/bản).',
    steps: [
      'Xuất trình bản chính cho công chức.',
      'Công chức đối chiếu bản sao.',
      'Ký chứng thực và đóng dấu.',
      'Trả kết quả.'
    ],
    notes: 'Bản chính không được tẩy xóa, sửa chữa.',
    category: 'civil'
  },
  {
    id: 'marriage-registration',
    name: 'Đăng ký kết hôn',
    targetAudience: 'Nam nữ đủ điều kiện kết hôn.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Tờ khai đăng ký kết hôn.',
      'CCCD của hai bên.',
      'Giấy xác nhận tình trạng hôn nhân (nếu cần).'
    ],
    duration: 'Giải quyết ngay.',
    fee: 'Miễn phí.',
    steps: ['Hai bên có mặt', 'Nộp hồ sơ', 'Ký giấy chứng nhận', 'Trả kết quả'],
    notes: 'Bắt buộc cả hai bên phải có mặt.',
    category: 'civil'
  },
  {
    id: 'livestock-reg',
    name: 'Đăng ký chăn nuôi',
    targetAudience: 'Cá nhân, hộ gia đình chăn nuôi trên địa bàn xã.',
    location: 'Bộ phận Khuyến nông - Địa chính UBND xã Bát Xát.',
    documents: [
      'Đơn đăng ký chăn nuôi.',
      'Bản kê khai số lượng vật nuôi.',
      'Cam kết bảo vệ môi trường trong chăn nuôi.'
    ],
    duration: 'Trong ngày.',
    fee: 'Miễn phí.',
    steps: ['Nộp đơn đăng ký', 'Cán bộ kiểm tra thực tế', 'Ghi vào hồ sơ quản lý', 'Trả kết quả'],
    notes: 'Bà con cần kê khai đúng số lượng để được hỗ trợ khi có dịch bệnh.',
    category: 'agriculture'
  },
  {
    id: 'animal-disease',
    name: 'Khai báo dịch bệnh động vật',
    targetAudience: 'Người chăn nuôi khi phát hiện gia súc, gia cầm có dấu hiệu bệnh lạ hoặc chết bất thường.',
    location: 'Trung tâm DVTH xã Bát Xát ĐT 0389981714',
    documents: [
      'Thông tin về tình trạng vật nuôi chết hoặc mắc bệnh.',
      'Địa điểm xảy ra ổ dịch.'
    ],
    duration: 'Xử lý ngay sau khi tiếp nhận thông báo.',
    fee: 'Miễn phí.',
    steps: ['Báo cáo ngay cho cán bộ thú y', 'Cán bộ xuống kiểm tra, lấy mẫu', 'Thực hiện biện pháp khoanh vùng, tiêu độc'],
    notes: 'Bà con tuyệt đối không tự ý bán hoặc vứt xác động vật chết ra môi trường.',
    category: 'agriculture'
  },
  {
    id: 'disaster-support',
    name: 'Hỗ trợ thiệt hại do thiên tai, dịch bệnh',
    targetAudience: 'Hộ nông dân bị thiệt hại về cây trồng, vật nuôi do thiên tai hoặc dịch bệnh nguy hiểm.',
    location: 'UBND xã Bát Xát (Bộ phận Nông nghiệp).',
    documents: [
      'Đơn đề nghị hỗ trợ thiệt hại.',
      'Biên bản xác nhận thiệt hại của thôn/bản.',
      'Giấy chứng nhận đăng ký chăn nuôi/sản xuất (nếu có).'
    ],
    duration: 'Theo đợt phê duyệt của cấp trên.',
    fee: 'Miễn phí.',
    steps: ['Kê khai thiệt hại với trưởng thôn', 'Xã thẩm định thực tế', 'Niêm yết danh sách hỗ trợ', 'Chi trả tiền hỗ trợ'],
    notes: 'Việc hỗ trợ chỉ thực hiện khi bà con đã đăng ký sản xuất/chăn nuôi trước đó.',
    category: 'agriculture'
  },
  {
    id: 'agri-production-confirm',
    name: 'Xác nhận sản xuất nông nghiệp',
    targetAudience: 'Người dân cần xác nhận để vay vốn hoặc thực hiện các thủ tục liên quan.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Đơn xin xác nhận sản xuất nông nghiệp.',
      'Giấy tờ chứng minh quyền sử dụng đất hoặc hợp đồng thuê đất.',
      'CCCD.'
    ],
    duration: '3 ngày làm việc.',
    fee: 'Theo quy định phí xác nhận.',
    steps: ['Nộp đơn', 'Cán bộ kiểm tra mô hình sản xuất', 'Lãnh đạo ký xác nhận', 'Trả kết quả'],
    notes: 'Giúp bà con chứng minh thu nhập và quy mô sản xuất khi giao dịch ngân hàng.',
    category: 'agriculture'
  },
  {
    id: 'poor-household-confirm',
    name: 'Xác nhận hộ nghèo',
    targetAudience: 'Hộ gia đình có nhu cầu xác nhận thông tin hộ nghèo, cận nghèo trên địa bàn xã.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Đơn đề nghị xác nhận hộ nghèo.',
      'Giấy tờ liên quan theo yêu cầu rà soát.'
    ],
    duration: 'Theo kế hoạch rà soát hộ nghèo hằng năm.',
    fee: 'Không thu.',
    steps: ['Nộp đơn đề nghị', 'Cán bộ rà soát, xác minh thực tế', 'Niêm yết công khai tại xã/thôn', 'Chủ tịch UBND xã ký xác nhận'],
    notes: 'Thông tin hộ gia đình sẽ được rà soát, xác minh thực tế kỹ lưỡng để đảm bảo đúng chính sách.',
    category: 'social',
    keywords: ['hộ nghèo', 'xác nhận hộ nghèo', 'xin hộ nghèo']
  },
  {
    id: 'monthly-social-allowance',
    name: 'Trợ cấp xã hội hàng tháng',
    targetAudience: 'Đối tượng thuộc diện bảo trợ xã hội theo quy định hiện hành.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Đơn đề nghị trợ cấp xã hội.',
      'Hồ sơ của đối tượng theo từng trường hợp.',
      'Giấy tờ tùy thân liên quan (CCCD, v.v.).'
    ],
    duration: 'Theo quy định hiện hành.',
    fee: 'Không thu.',
    steps: ['Nộp hồ sơ đầy đủ', 'Bộ phận Một cửa xã tiếp nhận, kiểm tra', 'Đội ngũ chuyên môn xem xét, họp xét duyệt', 'Trình cấp có thẩm quyền ra quyết định trợ cấp'],
    notes: 'Cần xác minh chính xác, đúng đối tượng được hưởng theo chính sách bảo trợ xã hội.',
    category: 'social',
    keywords: ['trợ cấp bảo trợ', 'bảo trợ xã hội', 'trợ cấp hàng tháng', 'trợ cấp xã hội hàng tháng']
  },
  {
    id: 'funeral-allowance',
    name: 'Hỗ trợ mai táng phí',
    targetAudience: 'Cá nhân hoặc tổ chức chịu trách nhiệm lo mai táng cho đối tượng được hưởng hỗ trợ.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Giấy chứng tử (bản chính hoặc bản sao trích lục).',
      'Đơn đề nghị hỗ trợ mai táng phí.',
      'Giấy tờ chứng minh, hồ sơ liên quan.'
    ],
    duration: 'Theo quy định hiện hành.',
    fee: 'Không thu.',
    steps: ['Nộp đơn và giấy chứng tử tại Một cửa', 'Công chức Lao động - Thương binh và Xã hội thẩm định', 'Trình lãnh đạo ký duyệt hỗ trợ kinh phí', 'Chi trả mai táng phí cho người đại diện'],
    notes: 'Một số đối tượng đặc thù cần thêm các giấy tờ chứng minh điều kiện hưởng chế độ cụ thể.',
    category: 'social',
    keywords: ['mai táng phí', 'hỗ trợ mai táng', 'tiền mai táng']
  },
  {
    id: 'disability-confirm',
    name: 'Xác nhận khuyết tật',
    targetAudience: 'Cá nhân đề nghị xác định hoặc xác định lại mức độ khuyết tật.',
    location: 'UBND xã Bát Xát.',
    documents: [
      'Đơn đề nghị xác định mức độ khuyết tật.',
      'Hồ sơ y tế, bệnh án liên quan (nếu có).',
      'Giấy tờ tùy thân bản gốc hoặc bản sao.'
    ],
    duration: 'Theo quy định hiện hành.',
    fee: 'Không thu.',
    steps: ['Gửi đơn và hồ sơ y tế cho UBND xã', 'Hội đồng bầu xác định mức độ khuyết tật tổ chức thẩm định', 'Lập biên bản kết luận tình trạng', 'Cấp giấy xác nhận khuyết tật'],
    notes: 'Trong một số trường hợp, Hội đồng xác định mức độ khuyết tật xã sẽ họp đánh giá trực tiếp.',
    category: 'social',
    keywords: ['xác nhận khuyết tật', 'giấy khuyết tật', 'xác định mức độ khuyết tật']
  },
  {
    id: 'meritorious-support',
    name: 'Hỗ trợ người có công',
    targetAudience: 'Thương bệnh binh, thân nhân liệt sĩ và những người có công cách mạng.',
    location: 'Bộ phận Một cửa UBND xã Bát Xát.',
    documents: [
      'Hồ sơ liên quan chứng minh diện hỗ trợ.',
      'Giấy tờ gốc hoặc giấy tờ chứng minh đối tượng.'
    ],
    duration: 'Theo quy định hiện hành.',
    fee: 'Không thu.',
    steps: ['Chuẩn bị hồ sơ đầy đủ bảo đảm pháp lý', 'Nộp hồ sơ trực tiếp tại UBND xã', 'Thẩm tra đối chiếu thông tin gốc', 'Trình cấp trên phê duyệt điều chỉnh hoặc chi hỗ trợ'],
    notes: 'Bà con đặc biệt lưu ý cần đối chiếu giấy tờ gốc khi nộp hồ sơ để tránh sai sót.',
    category: 'social',
    keywords: ['người có công', 'chế độ người có công', 'hồ sơ người có công']
  }
];

export async function askGeminiProcedure(query: string): Promise<Procedure | string> {
  const normQuery = query.toLowerCase().trim();

  // 1. Direct matched procedure check
  const directMatch = MOCK_PROCEDURES.find(p => p.name.toLowerCase() === normQuery);
  if (directMatch) return directMatch;

  // 2. Keyword/Substring search
  const keywordMatch = MOCK_PROCEDURES.find(p => 
    p.name.toLowerCase().includes(normQuery) ||
    (p.keywords && p.keywords.some(kw => normQuery.includes(kw.toLowerCase()) || kw.toLowerCase().includes(normQuery)))
  );
  if (keywordMatch) return keywordMatch;

  // 3. Fallback to Gemini LLM
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Người dân xã Bát Xát hỏi: "${query}". 
      Dựa trên danh sách các thủ tục hành chính sau đây, hãy xác định xem người dân đang muốn hỏi hoặc thực hiện thủ tục nào.
      Danh sách: ${MOCK_PROCEDURES.map(p => p.name).join(', ')}.
      
      Nếu khớp rõ ràng với một thủ tục, chỉ trả về đúng tên thủ tục đó (ví dụ: "Đăng ký khai sinh", "Xác nhận hộ nghèo").
      Nếu không khớp hoàn toàn nhưng thuộc diện chính sách như hộ nghèo, khuyết tật, mai táng phí, bảo trợ xã hội, hay đất đai, hộ tịch, nông nghiệp, hãy trả về một lời hướng dẫn ân cần, gần gũi (dùng từ "bà con"), giải thích chung và khuyên họ liên hệ Bộ phận Một cửa xã Bát Xát để được hướng dẫn chi tiết.
      Nếu câu hỏi không khớp hoặc hoàn toàn không liên quan, hãy trả lời lịch sự rằng ứng dụng hiện hỗ trợ hướng dẫn tra cứu thủ tục Hộ tịch, Đất đai, Nông nghiệp và Chính sách xã hội tại UBND xã Bát Xát, khuyên họ nhập câu hỏi cụ thể hơn hoặc liên hệ hotline để được trợ giúp tốt nhất.`,
    });

    const result = response.text?.trim() || "";
    const matched = MOCK_PROCEDURES.find(p => p.name.toLowerCase() === result.toLowerCase());
    
    return matched || result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Có lỗi xảy ra khi kết nối hệ thống. Bà con vui lòng thử lại sau hoặc đến trực tiếp UBND xã.";
  }
}
